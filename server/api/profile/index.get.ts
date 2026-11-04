import { serverDb } from '../../utils/db'

export default defineEventHandler(() => {
  const profile = serverDb.getProfile()
  return {
    success: true,
    data: profile
  }
})
