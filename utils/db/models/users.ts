import {
    DatabaseCollections,
    DatabaseId,
    DocumentModel,
    User
} from "../../../types/models";

export function UserModel(db: FirebaseFirestore.Firestore) {
    const Users = db.collection(DatabaseCollections.Users)

    async function createUser(user: User): Promise<DocumentModel<User>> {
        const { name, image, email } = user
        const userData = { name, image, email }
        const userDoc = await Users.add(userData)
        return {
            id: userDoc.id,
            ...userData
        }
    }

    async function getUser(id: DatabaseId): Promise<DocumentModel<User>> {
        const userDoc = await Users.doc(id).get()
        return userDoc.data() as DocumentModel<User>
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
        return userDoc.data() as DocumentModel<User>
    }

    async function updateUser(user: DocumentModel<User>): Promise<DocumentModel<User>> {
        const { id, name, email, image } = user
        await Users.doc(id).update({
            name,
            email,
            image
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
        getUserByEmail,
        updateUser,
        deleteUserById
    }
}
