import { serverDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ itemId: string }>(event)

  if (!body || !body.itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Se requiere el parámetro "itemId" para canjear un artículo.'
    })
  }

  const result = serverDb.buyShopItem(body.itemId)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.message
    })
  }

  return {
    success: true,
    message: result.message,
    data: {
      item: result.item,
      remainingLeaves: result.remainingLeaves
    }
  }
})
