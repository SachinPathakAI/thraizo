import { Story, UsageData } from './types'

const STORIES_KEY = 'dreamtales_stories'
const USAGE_KEY = 'dreamtales_usage'
const PREMIUM_KEY = 'dreamtales_premium'

export function getStories(): Story[] {
  try {
    const data = localStorage.getItem(STORIES_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveStory(story: Story): void {
  const stories = getStories()
  stories.unshift(story)
  // Keep max 50 stories
  if (stories.length > 50) stories.pop()
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories))
}

export function deleteStory(id: string): void {
  const stories = getStories().filter((s) => s.id !== id)
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories))
}

export function getUsageToday(): UsageData {
  const today = new Date().toISOString().split('T')[0]
  try {
    const data = localStorage.getItem(USAGE_KEY)
    if (data) {
      const usage: UsageData = JSON.parse(data)
      if (usage.date === today) return usage
    }
  } catch {
    // Reset on error
  }
  return { date: today, count: 0, isPremium: isPremium() }
}

export function incrementUsage(): UsageData {
  const usage = getUsageToday()
  usage.count += 1
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
  return usage
}

export function isPremium(): boolean {
  try {
    return localStorage.getItem(PREMIUM_KEY) === 'true'
  } catch {
    return false
  }
}

export function setPremium(value: boolean): void {
  localStorage.setItem(PREMIUM_KEY, value ? 'true' : 'false')
}
