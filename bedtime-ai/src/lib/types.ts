export interface StoryFormData {
  childName: string
  age: number
  interests: string
  familyPets: string
  photoUrl: string
  mood: string
  theme: string
}

export interface Story {
  id: string
  title: string
  content: string
  formData: StoryFormData
  createdAt: string
  moral: string
}

export interface UsageData {
  date: string
  count: number
  isPremium: boolean
}

export type AppView = 'home' | 'stories' | 'generating'

export const DAILY_FREE_LIMIT = 3
export const MONTHLY_PRICE = 4.99
export const YEARLY_PRICE = 49

export const MOODS = [
  { emoji: '😴', label: 'Sleepy' },
  { emoji: '🌟', label: 'Adventurous' },
  { emoji: '🦋', label: 'Calm' },
  { emoji: '🎉', label: 'Silly' },
  { emoji: '🌈', label: 'Hopeful' },
  { emoji: '🧙', label: 'Magical' },
]

export const THEMES = [
  { emoji: '🏰', label: 'Castle & Knights' },
  { emoji: '🚀', label: 'Space Adventure' },
  { emoji: '🧜', label: 'Under the Sea' },
  { emoji: '🌲', label: 'Enchanted Forest' },
  { emoji: '🦕', label: 'Dinosaur World' },
  { emoji: '🎪', label: 'Circus Fun' },
  { emoji: '🌙', label: 'Moonlit Journey' },
  { emoji: '🐾', label: 'Animal Friends' },
]
