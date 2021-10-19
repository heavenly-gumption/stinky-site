import {
    DatabaseCollections,
    DatabaseSubCollections,
    DatabaseId,
    DocumentModel,
    DotaPlayer
} from "../../../types/models";
import { bindIdToModel } from "./_model_util";

export function DotaPlayerModel(db: FirebaseFirestore.Firestore) {
    const Players = db.collection(DatabaseCollections.DotaPlayers)

    async function getDotaPlayer(discordId: string): Promise<DocumentModel<DotaPlayer>> {
        const doc = await Players.doc(discordId).get();
        const mmrHistory = await Players.doc(discordId).collection(DatabaseSubCollections.MMRHistory).get();
        return {
            id: doc.id,
            ...doc.data(),
            mmrHistory: mmrHistory.docs.map(history => {
                const data = history.data()
                return {
                    timestamp: parseInt(history.id),
                    ...data
                }
            })
        }
    }

    async function getDotaPlayers(): Promise<Array<DocumentModel<DotaPlayer>>> {
        const playerQuery = await Players.get()
        return playerQuery.docs.map(doc => bindIdToModel(doc.id, doc.data()))
    }

    return {
        getDotaPlayer,
        getDotaPlayers
    }
}