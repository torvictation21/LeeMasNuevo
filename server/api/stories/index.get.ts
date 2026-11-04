import { serverDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const genre = typeof query.genre === 'string' ? query.genre : undefined
  const difficulty = typeof query.difficulty === 'string' ? query.difficulty : undefined
  const search = typeof query.search === 'string' ? query.search : undefined

  const stories = serverDb.getStories({ genre, difficulty, search })

  return {
    success: true,
    total: stories.length,
    data: stories
  }
})
