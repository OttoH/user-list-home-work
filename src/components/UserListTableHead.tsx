import { TableHead, TableRow, TableCell, TableSortLabel, Box } from '@mui/material'
import { visuallyHidden } from '@mui/utils'

import { UserColumn } from './UserListTable'
import { Order } from '@/types/UserTable'

interface UserListTableHeadProps {
  columns: readonly UserColumn[]
  onRequestSort: (event: React.MouseEvent<unknown>) => void
  regAtOrder: Order
}

const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
  const isDate = orderBy === 'regAt'
  let aVal = a[orderBy] as string | number
  let bVal = b[orderBy] as string | number

  if (isDate) {
    const dateA = new Date(aVal)
    aVal = dateA.getTime()
    const dateB = new Date(bVal)
    bVal = dateB.getTime()
  }

  if (bVal < aVal) {
    return -1
  }
  if (bVal > aVal) {
    return 1
  }
  return 0
}

export const getComparator = <Key extends keyof any>(
  order: Order,
  orderBy: Key
): ((a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const UserListTableHead = (props: UserListTableHeadProps) => {
  const { columns, regAtOrder, onRequestSort } = props

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => {
          const cId = column.id

          switch (cId) {
            case 'regAt':
              return (
                <TableCell key={column.id} sortDirection={regAtOrder}>
                  <TableSortLabel active={true} direction={regAtOrder} onClick={onRequestSort}>
                    {column.label}
                    <Box component="span" sx={visuallyHidden}>
                      {regAtOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  </TableSortLabel>
                </TableCell>
              )

            default:
              return (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              )
          }
        })}
      </TableRow>
    </TableHead>
  )
}

export default UserListTableHead
