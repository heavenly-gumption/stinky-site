import { useEffect, useState, useRef } from 'react'
import { Howl, Howler } from 'howler'
import WaveformViewer from '../waveform-viewer'

const EDITOR_WIDTH = 800

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[ i ]);
    }
    return window.btoa(binary);
}

function offsetToSeconds(offset: number): number {
  return offset / 2 / 48000
}

function toTimestampStr(seconds: number): string {
  const mins = seconds < 60 ? '' : Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (Math.floor(seconds) % 60).toString().padStart(2, '0')
  const millis = (seconds % 1).toFixed(3).toString().slice(2, 5)
  return `${mins}:${secs}.${millis}`
}

function PlayHead({ height, position }) {
  const style = {
    width: '2px',
    height: (height ?? 0) + 'px',
    left: (position ?? 0) + 'px',
    bottom: '0px'
  }
  return (
    <div>
      <div className="absolute bg-black" style={style}>
      </div>
    </div>
  )
}

type ClipBoundaryHeadType = 'start' | 'end'
type ClipBoundaryHeadProps = { height: number, position: number, seconds: number, type: ClipBoundaryHeadType }
function ClipBoundaryHead({ height, seconds, clipDuration, type }) {
  const [time, setTime] = useState(seconds)

  const position = seconds / clipDuration * EDITOR_WIDTH

  const fullHeight = (height ?? 0) + 30
  const left = type === 'start' ? position : (position - 5)
  const lineStyle = {
    width: '5px',
    height: fullHeight + 'px',
    left: left + 'px',
    bottom: '-30px'
  }

  let flagStyle = {
    width: '100px',
    height: '30px',
    bottom: '0px'
  }

  if (type === 'start') {
    flagStyle['left'] = '-100px'
  } else {
    flagStyle['right'] = '-100px'
  }

  const color = type === 'start' ? 'bg-green-500' : 'bg-red-500'
  const className = 'absolute ' + color

  return (
    <div>
      <div className={className} style={lineStyle}>
        <div className={className} style={flagStyle}>
          <span className="select-none align-middle text-white">
            {toTimestampStr(time)}
          </span>
        </div>
      </div>
    </div>
  )
}

type ClipEditorProps = {
  clip: any,
  wavBuffer: ArrayBuffer,
  audioSrc: string
}
export default function ClipEditor({ clip, wavBuffer, audioSrc }: ClipEditorProps) {
  const [sound, setSound] = useState(null)
  const [pcmView, setPcmView] = useState(null)
  const [seekPosition, setSeekPosition] = useState(0)
  const soundRef = useRef(sound)
  const editorRef = useRef(null)

  useEffect(() => {
    if (sound) {
      sound.stop()
    }
    setPcmView(new DataView(wavBuffer, 44))
    const newSound = new Howl({
      src: audioSrc,
      html5: true
    })
    setSound(newSound)
    newSound.play()
    Howler.volume(0.5)
    return () => {
      if (sound) {
        sound.stop()
      }
    }
  }, [wavBuffer, audioSrc])

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeekPosition(sound.seek())
      }
    }, 10)
    return () => clearInterval(interval)
  })

  function onEditorClick(event) {
    const rect = editorRef.current.getBoundingClientRect()
    const relx = event.clientX - rect.x
    sound.seek(relx / EDITOR_WIDTH * sound.duration())
  }

  if (!sound) return null;

  const playHeadPos = seekPosition / sound.duration() * EDITOR_WIDTH
  const startSeconds = offsetToSeconds(clip.clipstart)
  const startPosition = startSeconds / sound.duration() * EDITOR_WIDTH

  const endSeconds = offsetToSeconds(clip.clipend)
  const endPosition = endSeconds / sound.duration() * EDITOR_WIDTH

  return (
    <div className="container px-4 text-center">
      <div ref={editorRef} className="relative mx-auto rounded-lg bg-blue-300" style={{width: EDITOR_WIDTH, height:150}} onClick={onEditorClick}>
        <div className="overflow-hidden">
          <WaveformViewer
            width={EDITOR_WIDTH}
            height={150}
            barWidth={3}
            barSpacing={1}
            padding={20}
            data={pcmView}/>
          <PlayHead height={150} position={playHeadPos}/>
        </div>
        <ClipBoundaryHead height={150} clipDuration={sound.duration()} seconds={startSeconds} type='start'/>
        <ClipBoundaryHead height={150} clipDuration={sound.duration()} seconds={endSeconds} type='end'/>
      </div>
    </div>
  )
}