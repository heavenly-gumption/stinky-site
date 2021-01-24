import { useSession, getSession } from 'next-auth/client'

export default function ProfileIndex() {
    const [ session, loading ] = useSession()
    console.log({
      session
    })

    if (loading) return null
  
    if (!loading && !session) return <p>Access Denied</p>
  
    return (
      <>
        <h1>Protected Page haha</h1>
        <p>You can view this page because you are signed in.</p>
      </>
    )
}