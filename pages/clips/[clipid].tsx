import useSWR from 'swr'
import Page from '../../components/scaffolding/page'
import { isAdminRole, isDefaultRole } from '../../utils/roles'
import { Howl, Howler } from 'howler'
import { useRouter } from 'next/router'

import { Clip } from "../../types/models"

import ClipEditor from '../../components/clips/clip-editor'

const fetcher = (url) => fetch(url).then((res) => res.json())

function writeBase64ToArrayBuffer(data: string, buffer: ArrayBuffer, offset: number) {
  const binaryString = atob(data)
  const len = binaryString.length
  const view = new Uint8Array(buffer)
  for (let i = 0; i < len; i++) {
    view[i + offset] = binaryString.charCodeAt(i)
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[ i ]);
    }
    return window.btoa(binary);
}

function writeWavHeader(buffer: ArrayBuffer, dataSize) {
  var numChannels = 1;
  var sampleRate = 48000;
  var bytesPerSample = 2;
  var blockAlign = numChannels * bytesPerSample;
  var byteRate = sampleRate * blockAlign;

  var dv = new DataView(buffer);

  var p = 0;

  function writeString(s) {
      for (var i = 0; i < s.length; i++) {
          dv.setUint8(p + i, s.charCodeAt(i));
      }
      p += s.length;
  }

  function writeUint32(d) {
      dv.setUint32(p, d, true);
      p += 4;
  }

  function writeUint16(d) {
      dv.setUint16(p, d, true);
      p += 2;
  }

  writeString('RIFF');              // ChunkID
  writeUint32(dataSize + 36);       // ChunkSize
  writeString('WAVE');              // Format
  writeString('fmt ');              // Subchunk1ID
  writeUint32(16);                  // Subchunk1Size
  writeUint16(1);                   // AudioFormat
  writeUint16(numChannels);         // NumChannels
  writeUint32(sampleRate);          // SampleRate
  writeUint32(byteRate);            // ByteRate
  writeUint16(blockAlign);          // BlockAlign
  writeUint16(bytesPerSample * 8);  // BitsPerSample
  writeString('data');              // Subchunk2ID
  writeUint32(dataSize);            // Subchunk2Size

  return buffer;
}

export default function ClipPage() {
  const router = useRouter()
  const { clipid } = router.query
  const { data, error } = useSWR(clipid ? `/api/clips/${clipid}` : null, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const wavBuffer = (new Uint8Array(44 + data.duration)).buffer
  writeWavHeader(wavBuffer, data.duration)
  writeBase64ToArrayBuffer(data.data, wavBuffer, 44)
  const audioSrc = 'data:audio/wav;base64,' + arrayBufferToBase64(wavBuffer)

  return (
    <Page
      isAllowedWithRoles={isDefaultRole}
      page={
        <div className="container px-4 text-center">
          <div> {data.id} </div>
          <ClipEditor clip={data} audioSrc={audioSrc} wavBuffer={wavBuffer}/>
        </div>
      }
    />
  )
}