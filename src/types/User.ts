export interface RawId {
  name: string
  value: string
}

export interface RawName {
  first: string
  last: string
  title: string
}

export interface RawRegistered {
  age: string
  date: string
}

export interface RawPicture {
  large: string
  medium: string
  thumbnail: string
}

export interface RawUserResult {
  id: RawId
  name: RawName
  email: string
  phone: string
  registered: RawRegistered
  nat: string
  picture: RawPicture
}

interface RawUserInfo {
  results: number
  page: number
}

export interface UserListResults {
  info: RawUserInfo
  results: RawUserResult[]
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  regAt: string
  nat: string
  pic: string
  status: 'ENABLED' | 'DISABLED'
}

interface UserInfo {
  rowsPerPage: number
  page: number
}

export interface UsersData {
  info: UserInfo
  users: User[]
}
