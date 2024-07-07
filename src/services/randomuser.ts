import getUserQueryUri from '@/utils/getUserQueryUri'

export const fetchUsers = async (page: number, rowsPerPage: number) => {
  const res = await fetch(getUserQueryUri({ page: page + 1, results: rowsPerPage }))
  return await res.json()
}
