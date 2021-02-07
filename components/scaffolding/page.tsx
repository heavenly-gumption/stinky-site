import Allowable from './allowable'
import { Role } from '../../types/models'

export default function Page({ isAllowedWithRoles, page, messageIfNotAllowed = "Access Denied" }: PageProps) {
    return <Allowable
      isAllowedWithRoles={isAllowedWithRoles}
      componentIfAllowed={page}
      componentIfNotAllowed={<>{messageIfNotAllowed}</>}
    />
}

export type PageProps = {
    isAllowedWithRoles: (roles: Role[]) => boolean,
    page: JSX.Element,
    messageIfNotAllowed?: string
}