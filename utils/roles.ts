import { Role, User } from "../types/models";

export function isNotNecessarilyAuthenticated(_: Role[]) {
    return true
}

export function isDefaultRole(roles: Role[]) {
    return roles.includes('user')
}

export function isAdminRole(roles: Role[]) {
    return roles.includes('admin')
}

export function getRolesFromSession(session: {
    user?: User
} | null) {
    return session?.user?.roles ?? []
}