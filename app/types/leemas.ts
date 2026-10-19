export type StoryGenre = 
  | 'Aventura'
  | 'Fantasía'
  | 'Ciencia Ficción'
  | 'Misterio'
  | 'Terror'
  | 'Microcuento'
  | 'Historia'
  | 'Humor'

export type StoryDifficulty = 'Fácil' | 'Intermedio' | 'Avanzado'

export type QuestionType = 'choice' | 'vocabulary' | 'inference' | 'true_false'

export interface StoryQuestion {
  id: string
  prompt: string
  type: QuestionType
  options: string[]
  correctIndex: number
  explanation: string
  hint?: string
}

export type StorySegment = 
  | { type: 'text'; label?: string; content: string }
  | { type: 'question'; question: StoryQuestion }

export interface Story {
  id: string
  title: string
  author: string
  genre: StoryGenre
  difficulty: StoryDifficulty
  readingTimeMin: number
  coverColor: string
  coverIcon: string
  synopsis: string
  isCommunity?: boolean
  segments: StorySegment[]
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  maxProgress?: number
  unlockedAt?: string
}

export interface ReadingProgress {
  currentSegment: number
  totalSegments: number
  completed: boolean
  lastReadAt: string
}

export interface UserProfile {
  name: string
  level: number
  xp: number
  xpNextLevel: number
  leaves: number // Monedas 'Hojas'
  streak: {
    current: number
    max: number
    lastReadDate: string // YYYY-MM-DD
    daysRead: string[]   // Array de fechas leídas
  }
  favoriteStoryIds: string[]
  completedStoryIds: string[]
  storyProgress: Record<string, ReadingProgress>
  badges: Badge[]
}
