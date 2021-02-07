import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import Adapter from '../../../utils/api/user-adapter'
import { Database } from '../../../utils/db/db'

const options: InitOptions = {
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    session: async (session, user) => {
      const fixedUserSession = {
        ...session,
        user
      }
      return fixedUserSession
    }
  },
  // A database is optional, but required to persist accounts in a database
  adapter: Adapter.Adapter({ db: Database() })
}

export default (req, res) => NextAuth(req, res, options)