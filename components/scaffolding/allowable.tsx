import { useSession } from 'next-auth/client'
import { Role, User } from '../../types/models'

export default function Allowable({ isAllowedWithRoles, componentIfAllowed, componentIfNotAllowed = null }: AllowableProps) {
    const [ session, loading ] = useSession()
    const user = session?.user as User
    const roles = user?.roles ?? []
    if (loading) return null
  
    const isAllowed = session && isAllowedWithRoles(roles)
    return !loading && isAllowed ? componentIfAllowed : componentIfNotAllowed
}

export type AllowableProps = {
    isAllowedWithRoles: (roles: Role[]) => boolean,
    componentIfAllowed: JSX.Element,
    componentIfNotAllowed?: JSX.Element | null
}