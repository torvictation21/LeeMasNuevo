import type { Story, UserProfile, Category, ShopItem } from '~/types/leemas'
import { SEED_STORIES, INITIAL_BADGES } from '~/data/stories'
import { SERVER_CATEGORIES } from '../data/categories.data'
import { SERVER_SHOP_ITEMS } from '../data/shop.data'

// In-memory mock database for the server runtime
class ServerDatabase {
  private stories: Story[] = [...SEED_STORIES]
  private categories: Category[] = [...SERVER_CATEGORIES]
  private shopItems: ShopItem[] = [...SERVER_SHOP_ITEMS]
  private userProfile: UserProfile = {
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

  // Categories
  getCategories(): Category[] {
    // Dynamically calculate story counts per category
    return this.categories.map((cat) => {
      const count = this.stories.filter((s) => s.genre === cat.name).length
      return {
        ...cat,
        totalStories: Math.max(cat.totalStories, count)
      }
    })
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find(
      (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.name.toLowerCase() === slug.toLowerCase()
    )
  }

  // Stories
  getStories(filters?: { genre?: string; difficulty?: string; search?: string }): Story[] {
    let result = [...this.stories]

    if (filters?.genre && filters.genre !== 'Todos') {
      result = result.filter(
        (s) => s.genre.toLowerCase() === filters.genre!.toLowerCase()
      )
    }

    if (filters?.difficulty && filters.difficulty !== 'Todas') {
      result = result.filter(
        (s) => s.difficulty.toLowerCase() === filters.difficulty!.toLowerCase()
      )
    }

    if (filters?.search) {
      const q = filters.search.trim().toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.synopsis.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q)
      )
    }

    return result
  }

  getStoryById(id: string): Story | undefined {
    return this.stories.find((s) => s.id === id)
  }

  addStory(newStory: Omit<Story, 'id'>): Story {
    const id =
      'community-' +
      Date.now() +
      '-' +
      newStory.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .slice(0, 20)

    const story: Story = {
      ...newStory,
      id,
      isCommunity: true
    }

    this.stories.unshift(story)
    return story
  }

  // Profile
  getProfile(): UserProfile {
    return { ...this.userProfile }
  }

  updateProfile(partial: Partial<UserProfile>): UserProfile {
    this.userProfile = {
      ...this.userProfile,
      ...partial,
      streak: partial.streak
        ? { ...this.userProfile.streak, ...partial.streak }
        : this.userProfile.streak,
      storyProgress: partial.storyProgress
        ? { ...this.userProfile.storyProgress, ...partial.storyProgress }
        : this.userProfile.storyProgress
    }
    return { ...this.userProfile }
  }

  // Shop
  getShopItems(): ShopItem[] {
    return [...this.shopItems]
  }

  buyShopItem(itemId: string): { success: boolean; message: string; remainingLeaves?: number; item?: ShopItem } {
    const item = this.shopItems.find((i) => i.id === itemId)
    if (!item) {
      return { success: false, message: 'El artículo solicitado no existe.' }
    }

    if (this.userProfile.leaves < item.price) {
      return {
        success: false,
        message: `Hojas insuficientes. Necesitas ${item.price} hojas y tienes ${this.userProfile.leaves}.`
      }
    }

    // Deduct leaves and add to inventory
    this.userProfile.leaves -= item.price
    if (!this.userProfile.inventory) {
      this.userProfile.inventory = []
    }
    if (!this.userProfile.inventory.includes(itemId)) {
      this.userProfile.inventory.push(itemId)
    }

    return {
      success: true,
      message: `¡Has adquirido "${item.name}" con éxito!`,
      remainingLeaves: this.userProfile.leaves,
      item
    }
  }
}

// Global server instance
export const serverDb = new ServerDatabase()
