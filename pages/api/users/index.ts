import { NextApiRequest, NextApiResponse } from 'next'
import { handleRequest } from '../../../utils/api/request'
import { Database } from '../../../utils/db/db'
import { UserModel } from '../../../utils/db/models/users'
import { isDefaultRole } from '../../../utils/roles'

export default handleRequest({
    GET: [isDefaultRole, getUsers]
})

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
    const db = Database()
    const allUsers = await UserModel(db).getAllUsers()
    res.status(200).json({ users: allUsers })
}