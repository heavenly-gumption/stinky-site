import { DiscordClient } from '../../../../utils/discord/discord'


export default async (req, res) => {
  const {
    query: { userid }
  } = req

  const client = await DiscordClient()
  console.log(client)
  try {
    const user = await client.users.fetch(userid)
    console.log(user)
    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json('Unexpected error when getting Discord user')
  }
}