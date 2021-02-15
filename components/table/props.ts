import { createContext } from "react"
import { Comparators, SortableDataOptions } from "./sortableData"

export type TableProps<M> = {
    order: (keyof M)[],
    data: M[],
    getId: (datum: M) => string,
    comparators?: Partial<Comparators<M>>
}

export type TableContextProps<M> = TableProps<M> & {
    sortBy: (key: keyof M) => void,
    sortOptions: Partial<SortableDataOptions<M>>
}

export const TableContext = createContext({})