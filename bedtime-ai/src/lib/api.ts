import { StoryFormData, Story } from './types'

export async function generateStory(formData: StoryFormData): Promise<Story> {
  const response = await fetch('/api/generate-story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to generate story' }))
    throw new Error(error.message || 'Failed to generate story')
  }

  return response.json()
}

export async function createCheckoutSession(priceType: 'monthly' | 'yearly'): Promise<string> {
  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceType }),
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }

  const { url } = await response.json()
  return url
}
