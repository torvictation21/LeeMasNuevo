import { serverDb } from '../../utils/db'
import type { Story } from '~/types/leemas'

export default defineEventHandler(async (event) => {
  const body = await readBody<Omit<Story, 'id'>>(event)

  if (!body || !body.title || !body.synopsis || !body.genre || !body.segments) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos incompletos. Se requiere título, sinopsis, género y segmentos de lectura.'
    })
  }

  const createdStory = serverDb.addStory(body)

  setResponseStatus(event, 201)
  return {
    success: true,
    message: 'Historia comunitaria creada exitosamente en el servidor.',
    data: createdStory
  }
})
