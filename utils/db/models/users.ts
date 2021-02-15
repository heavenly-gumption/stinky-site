import {
    DatabaseCollections,
    DatabaseId,
    DocumentModel,
    User
} from "../../../types/models";
import { bindIdToModel } from "./_model_util";

export function UserModel(db: FirebaseFirestore.Firestore) {
    const Users = db.collection(DatabaseCollections.Users)

    async function createUser(user: User): Promise<DocumentModel<User>> {
        const { name, image, email, roles } = user
        const userData = { name, image, email, roles }
        const userDoc = await Users.add(userData)
        return bindIdToModel<User>(userDoc.id, userData)
    }

    async function getUser(id: DatabaseId): Promise<DocumentModel<User>> {
        const userDoc = await Users.doc(id).get()
        return bindIdToModel<User>(id, userDoc.data())
    }

    async function getAllUsers(): Promise<DocumentModel<User>[]> {
        const userDocs = await Users.get();
        const allUsersData = userDocs.docs.map(doc => bindIdToModel<User>(doc.id, doc.data()))
        return allUsersData
    }

    async function getUserByEmail(email: string): Promise<DocumentModel<User>> {
        const query = await Users.where('email', '==', email).get()
        if (query.empty) {
            return null
        }
        if (query.size != 1) {
            throw new Error('More than one user has the same email address')
        }
        const userDoc = query.docs[0]
        return bindIdToModel<User>(userDoc.id, userDoc.data())
    }

    async function updateUser(user: DocumentModel<User>): Promise<DocumentModel<User>> {
        const { id, name, email, image, roles } = user
        await Users.doc(id).update({
            name,
            email,
            image,
            roles
        })
        return user
    }

    async function deleteUserById(id: DatabaseId): Promise<void> {
        await Users.doc(id).delete()
        return
    }

    return {
        createUser,
        getUser,
        getAllUsers,
        getUserByEmail,
        updateUser,
        deleteUserById
    }
}
