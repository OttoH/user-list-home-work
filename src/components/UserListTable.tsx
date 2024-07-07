'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import {
  Avatar,
  Backdrop,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Fade,
  FormControlLabel,
  Modal,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material'

import EmailIcon from '@mui/icons-material/Email'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import Grid3x3Icon from '@mui/icons-material/Grid3x3'
import HowToRegIcon from '@mui/icons-material/HowToReg'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { User } from '@/types/User'
import { Order } from '@/types/UserTable'
import userResultHelper from '@/utils/userResultHelper'
import { fetchUsers } from '@/services/randomuser'

import SearchInput from './SearchInput'
import UserListTableHead, { getComparator } from './UserListTableHead'
import EmptyTableRow from './EmptyTableRow'

interface UserListTable {
  initPage?: number
  initResults?: number
  initData?: any
  initSearchName?: string
}

export interface UserColumn {
  id: 'name' | 'email' | 'nat' | 'regAt' | 'status'
  label: string
  numeric: boolean
  minWidth?: number
  align?: 'right'
  format?: (value: number | string) => string
}

const columns: readonly UserColumn[] = [
  { id: 'name', label: 'Name', numeric: false, minWidth: 180 },
  {
    id: 'email',
    label: 'Email',
    numeric: false,
    minWidth: 180,
  },
  {
    id: 'nat',
    label: 'Nationality',
    numeric: false,
    minWidth: 60,
  },
  {
    id: 'regAt',
    label: 'Reg. At',
    numeric: false,
    minWidth: 100,
    format: (value) => {
      const date = new Date(value || '')
      return date.toLocaleString('en-US')
    },
  },
  {
    id: 'status',
    label: 'Status',
    numeric: false,
    minWidth: 120,
  },
]

interface Data {
  name: string
  code: string
  population: number
  size: number
  density: number
}

const UserListTable = (props?: UserListTable) => {
  const { initPage = 0, initResults = 10, initData = [], initSearchName } = props || {}
  const [users, setUsers] = useState(initData)
  const [page, setPage] = useState(initPage)
  const [rowsPerPage, setRowsPerPage] = useState(initResults)

  const [searchName, setSearchName] = useState(initSearchName)
  const pageCursorRef = useRef<number>(initPage)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenUsr, setModalOpenUsr] = useState<User | null>(null)

  const [regOrder, setRegOrder] = useState<Order>('desc')

  // just use tanstack for fetching hook. This works like native fetch in uesEffect.
  // The new user pagination data will be appended manually later.
  const { data: paginatedData, isFetching } = useQuery({
    queryKey: ['results', page],
    queryFn: () => fetchUsers(page, rowsPerPage),
    placeholderData: keepPreviousData,
    enabled: page > pageCursorRef.current,
  })

  const handleChangePage = (_event: unknown, newPage: number) => {
    setSearchName('')
    setPage(newPage)
  }

  const handleRowClick = (event: React.MouseEvent<unknown>, id: string) => {
    event.stopPropagation()

    users.some((usr: User) => {
      setModalOpenUsr(usr)
      if (usr.id === id) {
        setModalOpenUsr(usr)
        setModalOpen(true)
        return true
      } else {
        return false
      }
    })
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleUserStatusChange = (id?: string) => {
    if (!id) {
      return
    }

    const newUser = users.map((usr: User) => {
      if (usr.id === id) {
        usr.status = usr.status === 'ENABLED' ? 'DISABLED' : 'ENABLED'
      }
      return usr
    })

    setUsers(newUser)
  }

  const handleRequestRegSort = (event: React.MouseEvent<unknown>) => {
    const isAsc = regOrder === 'asc'
    setRegOrder(isAsc ? 'desc' : 'asc')
  }

  // append the new users to existed user data manually
  useEffect(() => {
    if (pageCursorRef.current > page) {
      return
    }

    const newData = userResultHelper(paginatedData)

    if (newData.info.page - pageCursorRef.current === 1) {
      setUsers((prev: User[]) => [...prev, ...newData.users])
      pageCursorRef.current = newData.info.page
    }
  }, [paginatedData, page])

  // search by data attributes
  useEffect(() => {
    if (searchName) {
      document.querySelectorAll('tr[data-search]').forEach((node) => {
        // @ts-ignore
        node.style.opacity = '0.1'
      })

      document.querySelectorAll(`tr[data-search*="${searchName}" i]`).forEach((node) => {
        // @ts-ignore
        node.style.opacity = '1'
      })
    } else {
      document.querySelectorAll('tr[data-search]').forEach((node) => {
        // @ts-ignore
        node.style.opacity = '1'
      })
    }
  }, [searchName])

  const emptyRows = useMemo(() => {
    const rowNumbers = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0
    return <EmptyTableRow count={rowNumbers} columnCount={5} />
  }, [users, page, rowsPerPage])

  const visibleRows = useMemo(
    () => users.sort(getComparator(regOrder, 'regAt')).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [users, regOrder, page, rowsPerPage]
  )

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <SearchInput defaultValue={searchName} onChange={(text) => setSearchName(text)} />

      <Paper
        sx={{ width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
      >
        <TableContainer sx={{ maxHeight: 480 }}>
          <Table stickyHeader aria-label="user list table">
            <UserListTableHead regAtOrder={regOrder} columns={columns} onRequestSort={handleRequestRegSort} />
            <TableBody>
              {visibleRows.map((usr: User) => {
                return (
                  <TableRow
                    hover
                    role="users-table"
                    tabIndex={-1}
                    key={usr.id}
                    data-search={usr.name}
                    onClick={(event) => handleRowClick(event, usr.id)}
                  >
                    {columns.map((column) => {
                      const value = usr[column.id]
                      switch (column.id) {
                        case 'status':
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Chip label={value} color={value === 'DISABLED' ? 'warning' : 'info'} />
                            </TableCell>
                          )
                        default:
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format ? column.format(value) : value}
                            </TableCell>
                          )
                      }
                    })}
                  </TableRow>
                )
              })}
              {emptyRows}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={Infinity}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          disabled={isFetching}
        />
      </Paper>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: 'absolute' as 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Card
              sx={{
                boxShadow: 24,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <Avatar alt={modalOpenUsr?.name} src={modalOpenUsr?.pic} sx={{ width: 120, height: 120 }} />
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ minWidth: '320px' }}>
                  <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {modalOpenUsr?.name}
                    </Typography>
                    <Chip label={modalOpenUsr?.nat} color="info" variant="outlined" />
                  </Stack>

                  <Stack spacing={2}>
                    <Box display="flex" flexDirection="row" alignItems="center" width="100%" color="text.secondary">
                      <EmailIcon fontSize="small" color="inherit" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        {modalOpenUsr?.email}
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" alignItems="center" width="100%" color="text.secondary">
                      <SmartphoneIcon fontSize="small" color="inherit" />
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        {modalOpenUsr?.phone}
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" alignItems="center" width="100%" color="text.secondary">
                      <Grid3x3Icon fontSize="small" color="inherit" />
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        {modalOpenUsr?.id}
                      </Typography>
                    </Box>

                    <Box display="flex" flexDirection="row" alignItems="center" width="100%" color="text.secondary">
                      <HowToRegIcon fontSize="small" color="inherit" />
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        {new Date(modalOpenUsr?.regAt || '').toLocaleString('en-US')}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box display="flex" width="100%" pt={4}>
                    <FormControlLabel
                      label={modalOpenUsr?.status}
                      control={
                        <Switch
                          checked={modalOpenUsr?.status === 'ENABLED'}
                          onChange={() => handleUserStatusChange(modalOpenUsr?.id)}
                          inputProps={{
                            'aria-label': `${modalOpenUsr?.status === 'ENABLED' ? 'disable' : 'enable'} ${
                              modalOpenUsr?.name
                            }`,
                          }}
                          color="info"
                        />
                      }
                    />
                  </Box>
                </CardContent>
              </Box>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}

export default UserListTable
