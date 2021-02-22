import { Clip } from "../../../types/models"
import { ClipModel } from "../../../utils/db/models/clips"
import { Database } from "../../../utils/db/db"

export default async (req, res) => {
  const {
    query: { clipid }
  } = req
  try {
    const clip = await ClipModel(Database()).getClip(clipid)
    res.status(200).json(clip)
  } catch (err) {
    console.error(err)
    res.status(500).json('Unexpected error when getting clip')
  }
}