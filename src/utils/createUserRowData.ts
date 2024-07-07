import { RawId, RawName, RawPicture, RawRegistered, User } from '@/types/User'

const createUserRowData = (
  id: RawId,
  name: RawName,
  email: string,
  phone: string,
  regAt: RawRegistered,
  nation: string,
  picture: RawPicture
): User => {
  const composedName = `${name.first} ${name.last}`
  return {
    id: `${id.name || composedName.replace(' ', '')}-${id.value || Date.now()}`,
    name: composedName,
    email,
    phone,
    regAt: `${regAt.date}`,
    nat: nation,
    pic: picture.large,
    status: 'ENABLED',
  }
}

export default createUserRowData
