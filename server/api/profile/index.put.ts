import { serverDb } from '../../utils/db'
import type { UserProfile } from '~/types/leemas'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<UserProfile>>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cuerpo de la petición vacío.'
    })
  }

  const updatedProfile = serverDb.updateProfile(body)

  return {
    success: true,
    message: 'Perfil de usuario sincronizado correctamente.',
    data: updatedProfile
  }
})
