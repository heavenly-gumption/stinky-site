import { DotaPlayerModel } from "../../../utils/db/models/dotaplayers"
import { Database } from "../../../utils/db/db"

export default async (req, res) => {
  const {
    query: { playerid }
  } = req
  try {
    const player = await DotaPlayerModel(Database()).getDotaPlayer(playerid)
    res.status(200).json(player)
  } catch (err) {
    console.error(err)
    res.status(500).json('Unexpected error when getting dota player')
  }
}