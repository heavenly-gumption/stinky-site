import { DiscordClient } from '../../../../utils/discord/discord'

export default async (req, res) => {
  const {
    query: { userid }
  } = req

  try {
    const user = await DiscordClient().users.fetch(userid)
    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json('Unexpected error when getting Discord user')
  }
}