import { useContext } from "react"
import { TableContext, TableContextProps } from "./props"

export function TableBody<M>() {
    const {
        order,
        data,
        getId
    } = useContext(TableContext) as TableContextProps<M>
    return (
        <tbody>
            {data.map(datum => <tr key={getId(datum)}>
                {order.map(heading => <td key={heading as string}>{datum[heading]}</td>)}
            </tr>)}
        </tbody>
    )
}
