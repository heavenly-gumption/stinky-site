import S3 from "aws-sdk/clients/s3"

import { Clip } from "../../../types/models"
import { ClipModel } from "../../../utils/db/models/clips"
import { Database } from "../../../utils/db/db"

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET
})

async function getClipDataFromS3(clip: Clip): Promise<Buffer> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `clips/${clip.id}.pcm`
  }

  const data = await s3.getObject(params).promise()
  return data.Body as Buffer
}

export default async (req, res) => {
  const {
    query: { clipid }
  } = req
  try {
    const clip = await ClipModel(Database()).getClip(clipid)
    const clipData = await getClipDataFromS3(clip)
    res.status(200).json({
      ...clip,
      data: clipData.toString('base64')
    })
  } catch (err) {
    console.error(err)
    res.status(500).json('Unexpected error when getting clip')
  }
}