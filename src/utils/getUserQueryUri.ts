import { USERS_API } from "@/constants/urls"

interface UserQueryProps {
  page?: number
  results?: number
}

const INIT_PAGE = 1
const INIT_RESULT = 10

const getUserQueryUri = (props?: UserQueryProps) => {
  const { page = INIT_PAGE, results = INIT_RESULT } = props || {}
  return `${USERS_API}?inc=id,name,email,phone,registered,nat,picture&seed=jimcrypto&page=${page}&results=${results}`
}

export default getUserQueryUri
