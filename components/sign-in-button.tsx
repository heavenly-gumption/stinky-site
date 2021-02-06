import { signIn } from 'next-auth/client'

export default function SignInButton() {
    return (
      <button onClick={() => signIn('discord', {
        callbackUrl: `${process.env.NEXTAUTH_URL}/profile`
      })}>
        Sign in with Discord
      </button>
    )
}