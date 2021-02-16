import { ClipModel } from "../../../utils/db/models/clips"
import { Database } from "../../../utils/db/db"

export default async (req, res) => {
  try {
    const clips = await ClipModel(Database()).getAllClips()
    res.status(200).json(clips)
  } catch (err) {
    console.error(err)
    res.status(500).json('Unexpected error when getting clips')
  }
}