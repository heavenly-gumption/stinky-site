import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Role, User } from "../../types/models";
import { getRolesFromSession } from "../roles";

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export type MethodMatch = [
    (roles: Role[]) => boolean,
    (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>
]

export async function isRequestAuthenticated(req: NextApiRequest, isAllowedWithRoles: (roles: Role[]) => boolean) {
    const session = await getSession({ req })
    const roles = getRolesFromSession({
        user: session?.user as User
    })
    return isAllowedWithRoles(roles)
}

export function handleRequest(
    matchOnMethod: Partial<Record<HttpMethod, MethodMatch>>
) {
    return async function (
        req: NextApiRequest,
        res: NextApiResponse
    ) {
        const match = matchOnMethod[req.method as HttpMethod]
        if (!match) {
            res.status(405).end()
            return
        }
        const [isAllowedWithRoles, requestFunction] = match
        const isAllowed = await isRequestAuthenticated(req, isAllowedWithRoles)
        if (!isAllowed) {
            res.status(401).end()
            return
        }
        return requestFunction(req, res)
    }
}
