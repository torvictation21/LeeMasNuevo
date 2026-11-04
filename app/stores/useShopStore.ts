import { ref, computed } from 'vue'
import type { ShopItem } from '~/types/leemas'
import { useUserStore } from './useUserStore'

export const useShopStore = () => {
  const userStore = useUserStore()

  // Estado global
  const items = useState<ShopItem[]>('leemas-shop-items', () => [])
  const isLoading = useState<boolean>('leemas-shop-loading', () => false)
  const isPurchasing = useState<boolean>('leemas-shop-purchasing', () => false)
  const lastPurchaseMessage = useState<string | null>('leemas-shop-last-msg', () => null)
  const error = useState<string | null>('leemas-shop-error', () => null)
  const isFetched = useState<boolean>('leemas-shop-fetched', () => false)

  // Acciones (Actions)
  async function fetchCatalog(forceRefresh = false) {
    if (isFetched.value && !forceRefresh && items.value.length > 0) return

    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<{
        success: boolean
        data: ShopItem[]
        userLeaves?: number
        inventory?: string[]
      }>('/api/shop/items')

      if (response && response.data) {
        items.value = response.data
        isFetched.value = true
        if (response.inventory && response.inventory.length > 0) {
          response.inventory.forEach((id) => userStore.addToInventory(id))
        }
      }
    } catch (err: any) {
      console.warn('[ShopStore] Error al cargar catálogo de tienda:', err)
      error.value = err?.message || 'Error al conectar con la tienda'
    } finally {
      isLoading.value = false
    }
  }

  async function buyItem(item: ShopItem): Promise<{ success: boolean; message: string }> {
    isPurchasing.value = true
    error.value = null
    lastPurchaseMessage.value = null

    // Validar saldo del usuario
    if (userStore.profile.value.leaves < item.price) {
      const msg = `Hojas insuficientes. Tienes ${userStore.profile.value.leaves} y requieres ${item.price} hojas.`
      error.value = msg
      isPurchasing.value = false
      return { success: false, message: msg }
    }

    try {
      const response = await $fetch<{
        success: boolean
        message: string
        data: { item: ShopItem; remainingLeaves: number }
      }>('/api/shop/buy', {
        method: 'POST',
        body: { itemId: item.id }
      })

      if (response && response.success) {
        // Actualizar inventario y saldo en userStore
        userStore.profile.value.leaves = response.data.remainingLeaves
        userStore.addToInventory(item.id)
        userStore.syncProfile()

        lastPurchaseMessage.value = response.message
        return { success: true, message: response.message }
      }
    } catch (err: any) {
      console.warn('[ShopStore] Procesando canje en modo offline:', err)
      // Fallback local: descontar hojas y añadir al inventario
      const ok = userStore.deductLeaves(item.price)
      if (ok) {
        userStore.addToInventory(item.id)
        const msg = `¡Has adquirido "${item.name}"!`
        lastPurchaseMessage.value = msg
        return { success: true, message: msg }
      }
    } finally {
      isPurchasing.value = false
    }

    return { success: false, message: 'No se pudo completar la transacción.' }
  }

  // Getters computados
  const powerUps = computed(() => items.value.filter((i) => i.category === 'powerup'))
  const avatars = computed(() => items.value.filter((i) => i.category === 'avatar'))
  const themes = computed(() => items.value.filter((i) => i.category === 'theme'))

  function isItemPurchased(itemId: string): boolean {
    return userStore.hasItemInInventory(itemId)
  }

  return {
    // Estado
    items,
    isLoading,
    isPurchasing,
    lastPurchaseMessage,
    error,
    isFetched,

    // Getters
    powerUps,
    avatars,
    themes,
    isItemPurchased,

    // Acciones
    fetchCatalog,
    buyItem
  }
}
