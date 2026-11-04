import { computed, onMounted } from 'vue'
import type { Story, StoryQuestion } from '~/types/leemas'
import { useUserStore } from '~/stores/useUserStore'
import { useStoryStore } from '~/stores/useStoryStore'

/**
 * Composable puente que conecta con las Stores modulares (useUserStore y useStoryStore)
 * Garantiza total retrocompatibilidad para todas las páginas y componentes existentes.
 */
export function useGamification() {
  const userStore = useUserStore()
  const storyStore = useStoryStore()

  onMounted(() => {
    userStore.loadProfile()
    storyStore.fetchStories()
  })

  const allStories = computed<Story[]>(() => {
    return storyStore.stories.value
  })

  function loadState() {
    userStore.loadProfile()
    storyStore.fetchStories()
  }

  function getStoryById(id: string): Story | undefined {
    return storyStore.getStoryById(id)
  }

  function createUserStory(newStory: Omit<Story, 'id'>): Story {
    const created = storyStore.createStory(newStory)
    userStore.unlockBadge('storyteller')
    userStore.addXP(100)
    userStore.addLeaves(50)
    return created as any
  }

  return {
    profile: userStore.profile,
    allStories,
    loadState,
    getStoryById,
    addXP: userStore.addXP,
    addLeaves: userStore.addLeaves,
    toggleFavorite: userStore.toggleFavorite,
    isFavorite: userStore.isFavorite,
    updateStoryProgress: userStore.updateStoryProgress,
    completeStory: userStore.completeStory,
    recordDailyReading: userStore.recordDailyReading,
    unlockBadge: userStore.unlockBadge,
    createUserStory
  }
}
