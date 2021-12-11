import { Client, Intents } from 'discord.js'

var client: Client

export function DiscordClient() {
  if (client) return client;

  client = new Client({ intents: [Intents.FLAGS.GUILDS] })
  client.login(process.env.DISCORD_TOKEN)
  return client
}