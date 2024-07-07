import { RawUserResult, UserListResults, UsersData } from '@/types/User'
import createUserRowData from './createUserRowData'

const userResultHelper = (data: UserListResults): UsersData => {
  const { info, results = [] } = data || {}

  const normalizedInfo = {
    rowsPerPage: info?.results || 1,
    page: info?.page !== undefined ? info?.page - 1 : 0,
  }

  return {
    info: normalizedInfo,
    users: results.map((user: RawUserResult) => {
      const { id, name, email, phone, registered, nat, picture } = user
      return createUserRowData(id, name, email, phone, registered, nat, picture)
    }),
  }
}

export default userResultHelper
