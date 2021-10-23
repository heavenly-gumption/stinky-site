import { DotaPlayerModel } from "../../../utils/db/models/dotaplayers"
import { Database } from "../../../utils/db/db"

export default async (req, res) => {
  try {
    const players = await DotaPlayerModel(Database()).getDotaPlayers()
    res.status(200).json(players)
  } catch (err) {
    console.error(err)
    res.status(500).json('Unexpected error when getting dota players')
  }
}