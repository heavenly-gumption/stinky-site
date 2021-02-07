import { Role } from "../types/models";

export function isDefaultRole(roles: Role[]) {
    return roles.includes('user')
}

export function isAdminRole(roles: Role[]) {
    return roles.includes('admin')
}