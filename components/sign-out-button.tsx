import { signOut } from 'next-auth/client'

export default function SignOutButton() {
    return (
      <button onClick={() => signOut({
        callbackUrl: `${process.env.NEXTAUTH_URL}`
      })}>
        Sign Out
      </button>
    )
}