import { TableBody } from './body'
import { TableHeader } from './header'
import { TableContext, TableProps } from './props'
import { SortingDirection, useSortableData } from './sortableData'

export default function Table<M>({
    order,
    data,
    getId,
    comparators
}: TableProps<M>) {
    const [
        sortedData,
        _,
        sortBy
    ] = useSortableData(data, {
        sortingDirection: SortingDirection.ASCENDING
    }, comparators ?? {})
    return (
        <TableContext.Provider value={{
            order,
            data: sortedData,
            getId,
            sortBy
        }}>
            <table>
                <TableHeader />
                <TableBody />      
            </table>
        </TableContext.Provider>
    )
}
