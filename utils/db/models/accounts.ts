import {
    DatabaseCollections,
    DatabaseId,
    DocumentModel,
    Account
} from "../../../types/models";
import { bindIdToModel } from "./_model_util";

export function AccountModel(db: FirebaseFirestore.Firestore) {

    const Accounts = db.collection(DatabaseCollections.Accounts)
    async function createAccount(account: Account): Promise<DocumentModel<Account>> {
        const {
            userId,
            providerId,
            providerType,
            providerAccountId,
            refreshToken,
            accessToken,
            accessTokenExpires
        } = account
        const accountData = {
            userId,
            providerId,
            providerType,
            providerAccountId,
            refreshToken,
            accessToken,
            accessTokenExpires
        }
        const accountDoc = await Accounts.add(accountData)
        return bindIdToModel<Account>(accountDoc.id, accountData)
    }

    async function getAccount(id: DatabaseId): Promise<DocumentModel<Account>> {
        const accountDoc = await Accounts.doc(id).get()
        return bindIdToModel<Account>(id, accountDoc.data())
    }

    async function getAccountByProviderAccountId(providerId, providerAccountId): Promise<DocumentModel<Account>> {
        const query = await Accounts
            .where('providerId', '==', providerId)
            .where('providerAccountId', '==', providerAccountId)
            .get()
        if (query.empty) {
            return null
        }
        if (query.size != 1) {
            throw new Error('More than one account has the same provider account id')
        }
        const accountDoc = query.docs[0]
        return bindIdToModel<Account>(accountDoc.id, accountDoc.data())
    }

    async function deleteAccount(user: DocumentModel<Account>): Promise<void> {
        const { id } = user
        await Accounts.doc(id).delete()
        return
    }

    async function deleteAccountByProviderAccountId(providerId, providerAccountId): Promise<void> {
        const query = await Accounts
        .where('providerId', '==', providerId)
        .where('providerAccountId', '==', providerAccountId)
        .get()
        const deletions = query.docs.map(snapshot => 
            Accounts.doc(snapshot.id).delete()
        )
        await Promise.all(deletions)
        return
    }

    return {
        createAccount,
        getAccount,
        getAccountByProviderAccountId,
        deleteAccount,
        deleteAccountByProviderAccountId
    }
}
