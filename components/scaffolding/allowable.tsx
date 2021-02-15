import { useSession } from 'next-auth/client'
import { Role, User } from '../../types/models'
import { getRolesFromSession } from '../../utils/roles'

export default function Allowable({ isAllowedWithRoles, componentIfAllowed, componentIfNotAllowed = null }: AllowableProps) {
    const [ session, loading ] = useSession()
    const roles = getRolesFromSession({
        user: session?.user as User
    })
    if (loading) return null
  
    const isAllowed = session && isAllowedWithRoles(roles)
    return !loading && isAllowed ? componentIfAllowed : componentIfNotAllowed
}

export type AllowableProps = {
    isAllowedWithRoles: (roles: Role[]) => boolean,
    componentIfAllowed: JSX.Element,
    componentIfNotAllowed?: JSX.Element | null
}