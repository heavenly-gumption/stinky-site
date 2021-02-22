import S3 from "aws-sdk/clients/s3"

import { Clip } from "../../../types/models"
import { ClipModel } from "../../../utils/db/models/clips"
import { Database } from "../../../utils/db/db"

const MAX_RESPONSE_SIZE = 1023996 // multiple of 3 for clean conversion to base64

const s3 = new S3({
  accessKeyId: process.env.SITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.SITE_AWS_SECRET
})

async function getClipDataFromS3(clipid: string, start: number, end: number): Promise<Buffer> {
  const params = {
    Bucket: process.env.SITE_AWS_S3_BUCKET,
    Key: `clips/${clipid}.pcm`,
    Range: `bytes=${start}-${end}`
  }

  const data = await s3.getObject(params).promise()
  return data.Body as Buffer
}

// Cache clip durations - prevents multiple calls to the db when streaming the clip data
const clipDurationCache = new Map<string, number>()
export default async (req, res) => {
  const clipid: string = req.query.clipid
  const start: number = req.query.start ? +req.query.start : 0

  try {
    let duration: number;
    if (clipDurationCache.has(clipid)) {
      duration = clipDurationCache.get(clipid)
    } else {
      const clip = await ClipModel(Database()).getClip(clipid)
      duration = clip.duration
      clipDurationCache.set(clipid, duration)
    }
    const end = Math.min(duration, start + MAX_RESPONSE_SIZE - 1)
    const clipData = await getClipDataFromS3(clipid, start, end)
    res.status(200).json({
      data: clipData.toString('base64'),
      ptr: end + 1,
      duration: duration,
      done: (end >= duration)
    })
  } catch (err) {
    console.error(err)
    res.status(500).json('Unexpected error when getting clip')
  }
}