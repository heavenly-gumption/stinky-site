export type Environment = {
    DISCORD_CLIENT_ID: string,
    DISCORD_CLIENT_SECRET: string
}

declare let process: {
    env: Environment
}