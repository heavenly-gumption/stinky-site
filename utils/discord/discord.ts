import { Client, Intents } from 'discord.js'

var client: Client
var clientPromise: Promise<Client>

export async function DiscordClient() {
  if (client) return client;
  if (clientPromise) return clientPromise;

  clientPromise = setupClient()
  return clientPromise
}

async function setupClient(): Promise<Client> {
  const c = new Client()
  await c.login(process.env.DISCORD_TOKEN)
  return c
}