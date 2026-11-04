import { serverDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El parámetro "id" de la historia es requerido.'
    })
  }

  const story = serverDb.getStoryById(id)
  if (!story) {
    throw createError({
      statusCode: 404,
      statusMessage: `No se encontró la historia con ID "${id}".`
    })
  }

  return {
    success: true,
    data: story
  }
})
