import axios from 'axios'

export default async (req, res) => {
  const {
    query: { guildid }
  } = req

  try {
    const url = `https://discord.com/api/v8/guilds/${guildid}/members`
    const params = {
      limit: 1000
    }
    const headers = {
      'Authorization': 'Bot ' + process.env.DISCORD_TOKEN
    }
    const response = await axios.get(url, {params, headers})
    res.status(200).json(response.data)
  } catch (err) {
    console.error(err)
    res.status(500).json('Unexpected error when getting Discord user')
  }
}