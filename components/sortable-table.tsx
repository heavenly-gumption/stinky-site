import { useState } from 'react'

import styles from '../styles/SortableTable.module.css'

type Header = {
  field: string
  name: string
}

type RowCell = {
  data: any
  renderable?: null | React.ReactNode
}

type Row = {
  [fieldName: string]: RowCell
}

type Props = {
  headers: Header[]
  rows: Row[]
  filter?: (row: Row) => boolean
}

export default function SortableTable(props: Props) {
  const { headers, rows, filter } = props

  const [ sortedField, setSortedField ] = useState(headers[0].field)
  const [ sortAscending, setSortAscending ] = useState(true)

  const [ sortedRows, setSortedRows ] = useState(rows)

  const headerFields = headers.map(header => header.field)

  const onHeaderClicked = (field: string) => {
    if (sortedField === field) {
      setSortAscending(!sortAscending)
    } else {
      setSortedField(field)
      setSortAscending(true)
    }
    setSortedRows(rows.sort(sortFn))
  }

  const sortFn = (a, b) => {
    if (a[sortedField].data > b[sortedField].data)
      return sortAscending ? 1 : -1
    if (a[sortedField].data < b[sortedField].data)
      return sortAscending ? -1 : 1
    return 0
  }

  const getSortChar = function(field) {
    if (field === sortedField) {
      if (sortAscending) {
        return '\u2B06'
      } else {
        return '\u2B07'
      }
    }
    return ''
  }

  const headerElems = headers.map((header, i) => {
    return (
      <th key={i}>
        <button onClick={() => onHeaderClicked(header.field)}>
          { header.name } { getSortChar(header.field) }
        </button>
      </th>
    )
  })

  const filteredRows = filter ? sortedRows.filter(filter) : sortedRows
  const bodyElems = filteredRows.map((row, i) => {
    return (
      <tr key={i}>
        { headerFields.map(field => {
          return (
            <td key={field}>
              { row[field].renderable ?? row[field].data }
            </td>
          )
        })}
      </tr>
    )
  })

  return (
    <div>
      <table>
        <thead className={styles.header}>
          <tr>
            { headerElems }
          </tr>
        </thead>
        <tbody className={styles.body}>
          { bodyElems }
        </tbody>
      </table>
    </div>
  )
}