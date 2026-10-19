import { computed, ref, onMounted } from 'vue'
import type { Story, UserProfile, StoryQuestion } from '~/types/leemas'
import { SEED_STORIES, INITIAL_BADGES } from '~/data/stories'

const STORAGE_KEY_PROFILE = 'leemas_user_profile_v1'
const STORAGE_KEY_CUSTOM_STORIES = 'leemas_custom_stories_v1'

const defaultProfile: UserProfile = {
  name: 'Victoria',
  level: 4,
  xp: 340,
  xpNextLevel: 500,
  leaves: 120,
  streak: {
    current: 7,
    max: 12,
    lastReadDate: new Date().toISOString().split('T')[0],
    daysRead: ['2026-09-18', '2026-09-19', '2026-09-20', '2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24']
  },
  favoriteStoryIds: ['el-atlas-de-las-cosas-perdidas'],
  completedStoryIds: [],
  storyProgress: {
    'el-atlas-de-las-cosas-perdidas': {
      currentSegment: 2,
      totalSegments: 6,
      completed: false,
      lastReadAt: new Date().toISOString()
    }
  },
  badges: INITIAL_BADGES
}

export function useGamification() {
  const profile = useState<UserProfile>('leemas-profile', () => defaultProfile)
  const customStories = useState<Story[]>('leemas-custom-stories', () => [])
  const isLoaded = useState<boolean>('leemas-state-loaded', () => false)

  function loadState() {
    if (!import.meta.client || isLoaded.value) return
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE)
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        profile.value = { ...defaultProfile, ...parsed }
      }
      const savedCustom = localStorage.getItem(STORAGE_KEY_CUSTOM_STORIES)
      if (savedCustom) {
        customStories.value = JSON.parse(savedCustom)
      }
      isLoaded.value = true
    } catch (e) {
      console.error('Error cargando estado de Lee+:', e)
    }
  }

  function saveState() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile.value))
      localStorage.setItem(STORAGE_KEY_CUSTOM_STORIES, JSON.stringify(customStories.value))
    } catch (e) {
      console.error('Error guardando estado de Lee+:', e)
    }
  }

  onMounted(loadState)

  const allStories = computed<Story[]>(() => {
    return [...customStories.value, ...SEED_STORIES]
  })

  function getStoryById(id: string): Story | undefined {
    return allStories.value.find((s) => s.id === id)
  }

  function addXP(amount: number) {
    profile.value.xp += amount
    while (profile.value.xp >= profile.value.xpNextLevel) {
      profile.value.level += 1
      profile.value.xpNextLevel = Math.round(profile.value.xpNextLevel * 1.5)
      addLeaves(25) // Bonificación de hojas al subir de nivel
    }
    saveState()
  }

  function addLeaves(amount: number) {
    profile.value.leaves += amount
    saveState()
  }

  function toggleFavorite(storyId: string) {
    const idx = profile.value.favoriteStoryIds.indexOf(storyId)
    if (idx >= 0) {
      profile.value.favoriteStoryIds.splice(idx, 1)
    } else {
      profile.value.favoriteStoryIds.push(storyId)
    }
    saveState()
  }

  function isFavorite(storyId: string): boolean {
    return profile.value.favoriteStoryIds.includes(storyId)
  }

  function updateStoryProgress(storyId: string, currentSegment: number, totalSegments: number, completed = false) {
    profile.value.storyProgress[storyId] = {
      currentSegment,
      totalSegments,
      completed,
      lastReadAt: new Date().toISOString()
    }
    if (completed && !profile.value.completedStoryIds.includes(storyId)) {
      profile.value.completedStoryIds.push(storyId)
    }
    saveState()
  }

  function recordDailyReading() {
    const today = new Date().toISOString().split('T')[0]
    if (!profile.value.streak.daysRead.includes(today)) {
      profile.value.streak.daysRead.push(today)
      profile.value.streak.current += 1
      if (profile.value.streak.current > profile.value.streak.max) {
        profile.value.streak.max = profile.value.streak.current
      }
    }
    profile.value.streak.lastReadDate = today
    saveState()
  }

  function completeStory(storyId: string, stats: { xpEarned: number; leavesEarned: number; perfectScore: boolean }) {
    addXP(stats.xpEarned)
    addLeaves(stats.leavesEarned)
    recordDailyReading()

    const story = getStoryById(storyId)
    const totalSegments = story?.segments.length || 1
    updateStoryProgress(storyId, totalSegments, totalSegments, true)

    // Desbloquear logros correspondientes
    unlockBadge('first_step')
    if (stats.perfectScore) {
      unlockBadge('sharp_mind')
    }
    if (profile.value.streak.current >= 3) {
      unlockBadge('streak_3')
    }
    if (profile.value.streak.current >= 7) {
      unlockBadge('streak_7')
    }

    saveState()
  }

  function unlockBadge(badgeId: string) {
    const badge = profile.value.badges.find((b) => b.id === badgeId)
    if (badge && !badge.unlocked) {
      badge.unlocked = true
      badge.unlockedAt = new Date().toISOString().split('T')[0]
      addLeaves(15)
      saveState()
    }
  }

  function createUserStory(newStory: Omit<Story, 'id'>): Story {
    const id = 'user-' + Date.now() + '-' + newStory.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)
    const story: Story = {
      ...newStory,
      id,
      isCommunity: true
    }
    customStories.value.unshift(story)
    unlockBadge('storyteller')
    addXP(100)
    addLeaves(50)
    saveState()
    return story
  }

  return {
    profile,
    allStories,
    loadState,
    getStoryById,
    addXP,
    addLeaves,
    toggleFavorite,
    isFavorite,
    updateStoryProgress,
    completeStory,
    recordDailyReading,
    unlockBadge,
    createUserStory
  }
}
