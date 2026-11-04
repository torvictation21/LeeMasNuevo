import { serverDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const categories = serverDb.getCategories()
  return {
    success: true,
    total: categories.length,
    data: categories
  }
})
