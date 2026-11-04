import { serverDb } from '../../utils/db'

export default defineEventHandler(() => {
  const items = serverDb.getShopItems()
  const profile = serverDb.getProfile()

  return {
    success: true,
    userLeaves: profile.leaves,
    inventory: profile.inventory || [],
    totalItems: items.length,
    data: items
  }
})
