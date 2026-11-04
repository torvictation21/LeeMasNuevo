import { ref, computed } from 'vue'
import type { Story, StoryDifficulty, StoryGenre } from '~/types/leemas'
import { SEED_STORIES } from '~/data/stories'

export const useStoryStore = () => {
  // Estado global
  const stories = useState<Story[]>('leemas-stories-list', () => [...SEED_STORIES])
  const activeStory = useState<Story | null>('leemas-active-story', () => null)
  const searchQuery = useState<string>('leemas-story-search', () => '')
  const selectedDifficulty = useState<string>('leemas-story-difficulty', () => 'Todas')
  const isLoading = useState<boolean>('leemas-stories-loading', () => false)
  const error = useState<string | null>('leemas-stories-error', () => null)
  const isFetched = useState<boolean>('leemas-stories-fetched', () => false)

  // Acciones (Actions)
  async function fetchStories(forceRefresh = false) {
    if (isFetched.value && !forceRefresh && stories.value.length > 0) return

    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<{ success: boolean; data: Story[] }>('/api/stories')
      if (response && response.data) {
        stories.value = response.data
        isFetched.value = true
      }
    } catch (err: any) {
      console.warn('[StoryStore] Usando historias locales de respaldo:', err)
      // Mantenemos SEED_STORIES si falla la red
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStoryById(id: string): Promise<Story | undefined> {
    // Primero buscar en el estado local de la store
    const existing = stories.value.find((s) => s.id === id)
    if (existing) {
      activeStory.value = existing
      return existing
    }

    // Si no está, consultar al servidor
    isLoading.value = true
    try {
      const response = await $fetch<{ success: boolean; data: Story }>(`/api/stories/${id}`)
      if (response && response.data) {
        activeStory.value = response.data
        // Agregar a la lista si no existía
        if (!stories.value.some((s) => s.id === id)) {
          stories.value.push(response.data)
        }
        return response.data
      }
    } catch (err: any) {
      console.error(`[StoryStore] Error al obtener historia ${id}:`, err)
      error.value = err?.message || 'Error al obtener historia'
    } finally {
      isLoading.value = false
    }

    return undefined
  }

  async function createStory(newStory: Omit<Story, 'id'>): Promise<Story> {
    isLoading.value = true
    try {
      const response = await $fetch<{ success: boolean; data: Story }>('/api/stories', {
        method: 'POST',
        body: newStory
      })

      if (response && response.data) {
        stories.value.unshift(response.data)
        return response.data
      }
    } catch (err: any) {
      console.warn('[StoryStore] Error en servidor, creando localmente:', err)
    } finally {
      isLoading.value = false
    }

    // Fallback local en caso de error o sin conexión
    const localId =
      'user-' +
      Date.now() +
      '-' +
      newStory.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .slice(0, 20)

    const fallbackStory: Story = {
      ...newStory,
      id: localId,
      isCommunity: true
    }

    stories.value.unshift(fallbackStory)
    return fallbackStory
  }

  // Getters computados
  const communityStories = computed(() => {
    return stories.value.filter((s) => s.isCommunity)
  })

  const spotlightStory = computed(() => {
    return (
      stories.value.find((s) => s.id === 'cartas-desde-marte') ||
      stories.value.find((s) => s.id === 'el-atlas-de-las-cosas-perdidas') ||
      stories.value[0]
    )
  })

  function getStoryById(id: string): Story | undefined {
    return stories.value.find((s) => s.id === id)
  }

  function getFilteredStories(categoryFilter = 'Todos'): Story[] {
    return stories.value.filter((story) => {
      // Filtro por categoría/género
      const matchesCategory =
        categoryFilter === 'Todos' ||
        story.genre.toLowerCase() === categoryFilter.toLowerCase()

      // Filtro por dificultad
      const matchesDifficulty =
        selectedDifficulty.value === 'Todas' ||
        story.difficulty.toLowerCase() === selectedDifficulty.value.toLowerCase()

      // Filtro por texto de búsqueda
      const query = searchQuery.value.trim().toLowerCase()
      if (!query) return matchesCategory && matchesDifficulty

      const matchesQuery =
        story.title.toLowerCase().includes(query) ||
        story.author.toLowerCase().includes(query) ||
        story.synopsis.toLowerCase().includes(query) ||
        story.genre.toLowerCase().includes(query)

      return matchesCategory && matchesDifficulty && matchesQuery
    })
  }

  return {
    // Estado
    stories,
    activeStory,
    searchQuery,
    selectedDifficulty,
    isLoading,
    error,
    isFetched,

    // Getters
    communityStories,
    spotlightStory,
    getStoryById,
    getFilteredStories,

    // Acciones
    fetchStories,
    fetchStoryById,
    createStory
  }
}
