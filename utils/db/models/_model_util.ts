import { DatabaseId, DocumentModel } from "../../../types/models";

export function bindIdToModel<T>(id: DatabaseId, data) {
    const bindedData = {
        id,
        ...data
    }
    console.log(bindedData)
    return bindedData as DocumentModel<T>
}