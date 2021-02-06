import {
    DatabaseCollections,
    DocumentModel,
    User,
    Session,
    SessionAge,
    DatabaseId
} from "../../../types/models";
import { generateRandomToken } from "../../random";
import { bindIdToModel } from "./_model_util";

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60 * 1000
const DEFAULT_UPDATE_AGE = 0

function isSessionExpired(session: DocumentModel<Session>) {
    return new Date() > new Date(session.expires)
}

function shouldUpdateSession(session: DocumentModel<Session>, age: SessionAge) {
    return age.maxAge
}

export function SessionModel(db: FirebaseFirestore.Firestore, ageOptions: SessionAge = {
    maxAge: DEFAULT_MAX_AGE,
    updateAge: DEFAULT_UPDATE_AGE
}) {
    const Sessions = db.collection(DatabaseCollections.Sessions)

    async function createSession(user: DocumentModel<User>): Promise<DocumentModel<Session>> {
        const { maxAge } = ageOptions
        const { id } = user
        const dateExpires = new Date()
        dateExpires.setTime(dateExpires.getTime() + maxAge)
        const expires = dateExpires.toISOString()
        const sessionData = {
            expires,
            userId: id,
            sessionToken: generateRandomToken(),
            accessToken: generateRandomToken()
        }
        const sessionDoc = await Sessions.add(sessionData)
        return bindIdToModel<Session>(sessionDoc.id, sessionData)
    }

    async function getSessionByToken(sessionToken: string): Promise<DocumentModel<Session> | null> {
        const query = await Sessions.where('sessionToken', '==', sessionToken).get()
        if (query.empty) {
            return null
        }
        if (query.size != 1) {
            throw new Error('More than one session has the same email address')
        }
        const sessionDoc = query.docs[0]
        const session = bindIdToModel<Session>(sessionDoc.id, sessionDoc.data())
        if (isSessionExpired(session)) {
            await deleteSession(session.id)
            return null
        }
        return session
    }

    async function updateSession(session: DocumentModel<Session>, force): Promise<DocumentModel<Session>> {
        const { maxAge, updateAge } = ageOptions
        const { id, expires } = session
        let updatedExpiryDate = expires
        if (shouldUpdateSession(session, ageOptions)) {
            const dateSessionIsDueToBeUpdated = new Date(expires)
            dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() - maxAge)
            dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() + updateAge)
            if (new Date() > dateSessionIsDueToBeUpdated) {
                const newExpiryDate = new Date()
                newExpiryDate.setTime(newExpiryDate.getTime() + maxAge)
                updatedExpiryDate = newExpiryDate.toISOString()
            } else if (!force) {
                return null
            }
        }
        if (!force) {
            return null
        }

        await Sessions.doc(id).update({
            expires: updatedExpiryDate
        })
        return session
    }

    async function deleteSession(id: DatabaseId): Promise<void> {
        await Sessions.doc(id).delete()
        return
    }

    async function deleteSessionByToken(sessionToken: string): Promise<void> {
        const query = await Sessions.where('sessionToken', '==', sessionToken).get()
        const deletions = query.docs.map(snapshot => 
            Sessions.doc(snapshot.id).delete()
        )
        await Promise.all(deletions)
        return
    }

    return {
        createSession,
        getSessionByToken,
        updateSession,
        deleteSession,
        deleteSessionByToken
    }
}
