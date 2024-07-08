import { Box, Container, IconButton, InputBase, Paper } from '@mui/material'

import UserListTable from '@/components/UserListTable'
import getUserQueryUri from '@/utils/getUserQueryUri'
import userResultHelper from '@/utils/userResultHelper'

// Use server component to fetch first page of users
async function fetchUserData() {
  const res = await fetch(getUserQueryUri())

  if (!res.ok) {
    throw new Error('Failed to fetch random uers data')
  }

  const data = await res.json()

  return userResultHelper(data)
}

export default async function Home() {
  const userData = await fetchUserData()
  const { info, users } = userData || {}

  return (
    <Box
      component="main"
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      sx={{
        p: 1,
      }}
    >
      <Container maxWidth="laptop">
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" py={8}>
          <UserListTable initPage={info.page} initRowsPerPage={info.rowsPerPage} initData={users} />
        </Box>
      </Container>
    </Box>
  )
}
