import { useContext } from "react"
import { TableContext, TableContextProps } from "./props"

export function TableHeader<M>() {
    const {
        order,
        sortBy
    } = useContext(TableContext) as TableContextProps<M>
    return (
        <thead>
            <tr>
                {order.map(heading => 
                    <th key={heading as string} onClick={ () => sortBy(heading)}>
                        {heading}
                    </th>
                )}
            </tr>
        </thead>
    )
}