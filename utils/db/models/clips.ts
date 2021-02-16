import {
    DatabaseCollections,
    DatabaseId,
    DocumentModel,
    Clip
} from "../../../types/models";

const mapToClip = (data) => {
    return {
        ...data,
        time: data.time.toDate().getTime()
    }
}

export function ClipModel(db: FirebaseFirestore.Firestore) {
    const Clips = db.collection(DatabaseCollections.Clips)

    async function getClip(id: string): Promise<DocumentModel<Clip>> {
        const clipDoc = await Clips.doc(id).get()
        return mapToClip(clipDoc.data()) as Clip
    }

    async function getClipByName(name: string): Promise<DocumentModel<Clip>> {
        const query = await Clips.where('name', '==', name).get()
        if (query.empty) {
            return null
        }
        if (query.size != 1) {
            throw new Error('More than one clip has the same name')
        }
        return mapToClip(query.docs[0].data()) as Clip
    }

    async function getAllClips(): Promise<Array<DocumentModel<Clip>>> {
        const clipQuery = await Clips.get()
        return clipQuery.docs.map(doc => mapToClip(doc.data()) as DocumentModel<Clip>)
    }

    async function deleteClipByName(name: string): Promise<void> {
        const clip = await getClipByName(name)
        await Clips.doc(clip.id).delete()
    }

    async function createClip(clip: Clip): Promise<void> {
        await Clips.doc(clip.id).set(clip)
    }

    async function renameClip(oldName: string, newName: string): Promise<void> {
        const clip = await getClipByName(oldName)
        await Clips.doc(clip.id).update({ name: newName })
    }

    async function trimClip(name: string, start: number, end: number): Promise<void> {
        const clip = await getClipByName(name)
        await Clips.doc(clip.id).update({ clipstart: start, clipend: end })
    }

    return {
        getClip,
        getClipByName,
        getAllClips,
        deleteClipByName,
        createClip,
        renameClip,
        trimClip
    }
}