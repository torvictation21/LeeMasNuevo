import { serverDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El parámetro "slug" de la categoría es obligatorio.'
    })
  }

  const category = serverDb.getCategoryBySlug(slug)
  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: `No se encontró la categoría con identificador "${slug}".`
    })
  }

  // Also include the stories belonging to this category
  const stories = serverDb.getStories({ genre: category.name })

  return {
    success: true,
    data: {
      ...category,
      stories
    }
  }
})
