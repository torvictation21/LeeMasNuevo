import { ref, computed } from 'vue'
import type { Category, StoryGenre } from '~/types/leemas'

export const useCategoryStore = () => {
  // Estado reactivo global con useState de Nuxt para consistencia SSR y cliente
  const categories = useState<Category[]>('leemas-categories', () => [])
  const selectedCategory = useState<string>('leemas-selected-category', () => 'Todos')
  const isLoading = useState<boolean>('leemas-categories-loading', () => false)
  const error = useState<string | null>('leemas-categories-error', () => null)
  const isFetched = useState<boolean>('leemas-categories-fetched', () => false)

  // Acciones (Actions)
  async function fetchCategories(forceRefresh = false) {
    if (isFetched.value && !forceRefresh && categories.value.length > 0) return

    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<{ success: boolean; data: Category[] }>('/api/categories')
      if (response && response.data) {
        categories.value = response.data
        isFetched.value = true
      }
    } catch (err: any) {
      console.error('[CategoryStore] Error al cargar categorías del servidor:', err)
      error.value = err?.message || 'Error al conectar con el servidor de categorías'
    } finally {
      isLoading.value = false
    }
  }

  function selectCategory(categoryNameOrSlug: string) {
    selectedCategory.value = categoryNameOrSlug
  }

  function resetCategory() {
    selectedCategory.value = 'Todos'
  }

  // Getters / Propiedades computadas
  const categoryNames = computed<string[]>(() => {
    return ['Todos', ...categories.value.map((c) => c.name)]
  })

  const activeCategoryInfo = computed<Category | undefined>(() => {
    if (selectedCategory.value === 'Todos') return undefined
    return categories.value.find(
      (c) =>
        c.name.toLowerCase() === selectedCategory.value.toLowerCase() ||
        c.slug.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  })

  const popularCategories = computed<Category[]>(() => {
    return [...categories.value].sort((a, b) => b.popularityScore - a.popularityScore)
  })

  function getCategoryByName(name: StoryGenre | string): Category | undefined {
    return categories.value.find((c) => c.name.toLowerCase() === name.toLowerCase())
  }

  function getCategoryBySlug(slug: string): Category | undefined {
    return categories.value.find((c) => c.slug.toLowerCase() === slug.toLowerCase())
  }

  return {
    // Estado
    categories,
    selectedCategory,
    isLoading,
    error,
    isFetched,

    // Getters
    categoryNames,
    activeCategoryInfo,
    popularCategories,

    // Acciones
    fetchCategories,
    selectCategory,
    resetCategory,
    getCategoryByName,
    getCategoryBySlug
  }
}
