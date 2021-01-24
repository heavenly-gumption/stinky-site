import { signIn } from 'next-auth/client'

export default function SignInButton({ origin }: SignInButtonProps) {
    return (
      <button onClick={() => signIn('discord', {
        callbackUrl: `${origin}/profile`
      })}>
        Sign in with Discord
      </button>
    )
}

export type SignInButtonProps = {
    origin: string
}