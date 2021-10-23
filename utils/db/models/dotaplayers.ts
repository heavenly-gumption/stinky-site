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
            username: doc.data().username,
            lastMatchId: doc.data().lastMatchId,
            mmr: doc.data().mmr,
            steamId: doc.data().steamId,
            mmrHistory: mmrHistory.docs.map(history => {
                const data = history.data()
                return {
                    timestamp: parseInt(history.id),
                    oldMMR: data.oldMMR,
                    newMMR: data.newMMR,
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