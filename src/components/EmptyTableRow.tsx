import { useId } from 'react'
import { Skeleton, TableCell, TableRow } from '@mui/material'

interface EmptyTableRowProps {
  count: number
  columnCount: number
}

const EmptyTableRow = ({ count, columnCount }: EmptyTableRowProps) => {
  const id = useId()

  return new Array(count).fill(false).map((_, idx) => (
    <TableRow key={`${id}-${idx}`}>
      {new Array(columnCount).fill(false).map((_, cIdx) => (
        <TableCell key={`${id}-${idx}-${cIdx}-col`}>
          <Skeleton animation="pulse" />
        </TableCell>
      ))}
    </TableRow>
  ))
}

export default EmptyTableRow
