import { ref, computed } from 'vue'
import type { UserProfile, Badge, ReadingProgress } from '~/types/leemas'
import { INITIAL_BADGES } from '~/data/stories'

const STORAGE_KEY_PROFILE = 'leemas_user_profile_v1'

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
    daysRead: [
      '2026-09-18',
      '2026-09-19',
      '2026-09-20',
      '2026-09-21',
      '2026-09-22',
      '2026-09-23',
      '2026-09-24'
    ]
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
  badges: INITIAL_BADGES,
  inventory: ['streak_shield']
}

export const useUserStore = () => {
  const profile = useState<UserProfile>('leemas-user-profile', () => defaultProfile)
  const isLoaded = useState<boolean>('leemas-user-loaded', () => false)
  const isSyncing = useState<boolean>('leemas-user-syncing', () => false)

  // Cargar estado inicial (Cliente y Servidor)
  async function loadProfile() {
    if (isLoaded.value) return

    // Intentar leer de localStorage si estamos en el cliente
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_PROFILE)
        if (saved) {
          const parsed = JSON.parse(saved)
          profile.value = { ...defaultProfile, ...parsed }
        }
      } catch (e) {
        console.warn('[UserStore] Error al leer perfil de localStorage:', e)
      }
    }

    // Sincronizar con el servidor
    try {
      const response = await $fetch<{ success: boolean; data: UserProfile }>('/api/profile')
      if (response && response.data) {
        // Combinamos garantizando datos locales recientes
        profile.value = {
          ...response.data,
          ...profile.value,
          streak: {
            ...response.data.streak,
            ...profile.value.streak
          }
        }
      }
    } catch (e) {
      // Usamos el perfil local si el servidor no responde
    }

    isLoaded.value = true
  }

  // Persistir en localStorage y sincronizar con el Servidor
  async function syncProfile() {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile.value))
      } catch (e) {
        console.error('[UserStore] Error guardando en localStorage:', e)
      }
    }

    // Sincronizar en segundo plano con el servidor
    isSyncing.value = true
    try {
      await $fetch('/api/profile', {
        method: 'PUT',
        body: profile.value
      })
    } catch (err) {
      // Error silencioso en background sync
    } finally {
      isSyncing.value = false
    }
  }

  function addXP(amount: number) {
    profile.value.xp += amount
    while (profile.value.xp >= profile.value.xpNextLevel) {
      profile.value.level += 1
      profile.value.xpNextLevel = Math.round(profile.value.xpNextLevel * 1.5)
      addLeaves(25) // Bonificación de hojas al subir de nivel
    }
    syncProfile()
  }

  function addLeaves(amount: number) {
    profile.value.leaves += amount
    syncProfile()
  }

  function deductLeaves(amount: number): boolean {
    if (profile.value.leaves < amount) return false
    profile.value.leaves -= amount
    syncProfile()
    return true
  }

  function toggleFavorite(storyId: string) {
    const idx = profile.value.favoriteStoryIds.indexOf(storyId)
    if (idx >= 0) {
      profile.value.favoriteStoryIds.splice(idx, 1)
    } else {
      profile.value.favoriteStoryIds.push(storyId)
    }
    syncProfile()
  }

  function isFavorite(storyId: string): boolean {
    return profile.value.favoriteStoryIds.includes(storyId)
  }

  function updateStoryProgress(
    storyId: string,
    currentSegment: number,
    totalSegments: number,
    completed = false
  ) {
    profile.value.storyProgress[storyId] = {
      currentSegment,
      totalSegments,
      completed,
      lastReadAt: new Date().toISOString()
    }
    if (completed && !profile.value.completedStoryIds.includes(storyId)) {
      profile.value.completedStoryIds.push(storyId)
    }
    syncProfile()
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
    syncProfile()
  }

  function completeStory(
    storyId: string,
    stats: { xpEarned: number; leavesEarned: number; perfectScore: boolean }
  ) {
    addXP(stats.xpEarned)
    addLeaves(stats.leavesEarned)
    recordDailyReading()

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

    syncProfile()
  }

  function unlockBadge(badgeId: string) {
    const badge = profile.value.badges.find((b) => b.id === badgeId)
    if (badge && !badge.unlocked) {
      badge.unlocked = true
      badge.unlockedAt = new Date().toISOString().split('T')[0]
      addLeaves(15)
      syncProfile()
    }
  }

  function addToInventory(itemId: string) {
    if (!profile.value.inventory) {
      profile.value.inventory = []
    }
    if (!profile.value.inventory.includes(itemId)) {
      profile.value.inventory.push(itemId)
      syncProfile()
    }
  }

  function hasItemInInventory(itemId: string): boolean {
    return Boolean(profile.value.inventory?.includes(itemId))
  }

  return {
    // Estado
    profile,
    isLoaded,
    isSyncing,

    // Acciones
    loadProfile,
    syncProfile,
    addXP,
    addLeaves,
    deductLeaves,
    toggleFavorite,
    isFavorite,
    updateStoryProgress,
    completeStory,
    recordDailyReading,
    unlockBadge,
    addToInventory,
    hasItemInInventory
  }
}
