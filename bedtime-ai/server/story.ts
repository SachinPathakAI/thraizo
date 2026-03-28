import type { Request, Response } from 'express'

interface StoryFormData {
  childName: string
  age: number
  interests: string
  familyPets: string
  photoUrl: string
  mood: string
  theme: string
}

const SYSTEM_PROMPT = `You are DreamTales, an expert children's bedtime story author. You create warm, enchanting, personalized bedtime stories that help children drift off to sleep feeling safe, loved, and inspired.

RULES — follow these strictly:
1. LENGTH: 300-600 words. No more, no less.
2. PERSONALIZATION: Weave the child's name, age, interests, family members, and pets deeply into the story. The child is the hero/protagonist.
3. TONE: Calming, gentle, and soothing. The story should slow down toward the end, guiding the child toward sleep.
4. STRUCTURE: Begin with a gentle hook, build a small adventure or wonder, include a quiet resolution, and end with the child (character) falling asleep or feeling cozy and safe.
5. AGE-APPROPRIATE: Adjust vocabulary and complexity for the child's age (3-5: very simple words, short sentences; 6-8: moderate; 9-12: more sophisticated but still gentle).
6. MORAL: Include a subtle, positive moral or lesson (kindness, courage, curiosity, gratitude, friendship) — never preachy.
7. NO SCARY CONTENT: No villains, monsters, darkness, danger, or anything frightening. If there's a challenge, it's gentle and quickly resolved.
8. SENSORY DETAILS: Include soothing sensory descriptions — warm blankets, gentle breezes, soft starlight, the sound of rain, the smell of cookies.
9. ENDING: Always end on a peaceful, sleepy note. The last paragraph should be especially calming.
10. QUALITY: Write like a published children's author. Avoid generic phrases, clichés, and AI-sounding language. Each story should feel unique and handcrafted.

Respond with valid JSON only: { "title": "Story Title", "content": "Full story text with paragraph breaks using \\n\\n", "moral": "One-sentence moral of the story" }`

function buildUserPrompt(data: StoryFormData): string {
  const parts = [
    `Write a bedtime story for ${data.childName}, who is ${data.age} years old.`,
    `Tonight's mood: ${data.mood}. Theme: ${data.theme}.`,
  ]

  if (data.interests) {
    parts.push(`${data.childName} loves: ${data.interests}.`)
  }
  if (data.familyPets) {
    parts.push(`Family/pets to include: ${data.familyPets}.`)
  }

  parts.push(`Remember: make ${data.childName} the hero, keep it calming, and end peacefully.`)
  return parts.join(' ')
}

async function callGrokAPI(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GROK_API_KEY
  if (!apiKey) throw new Error('GROK_API_KEY not set')

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-3-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 1500,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Grok API error: ${response.status} — ${err}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callOpenAIAPI(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI API error: ${response.status} — ${err}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callAnthropicAPI(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.85,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic API error: ${response.status} — ${err}`)
  }

  const data = await response.json()
  return data.content[0].text
}

async function generateWithFallback(systemPrompt: string, userPrompt: string): Promise<string> {
  const providers = [
    { name: 'Grok', fn: callGrokAPI, key: 'GROK_API_KEY' },
    { name: 'OpenAI', fn: callOpenAIAPI, key: 'OPENAI_API_KEY' },
    { name: 'Anthropic', fn: callAnthropicAPI, key: 'ANTHROPIC_API_KEY' },
  ]

  const errors: string[] = []

  for (const provider of providers) {
    if (!process.env[provider.key]) continue
    try {
      console.log(`Trying ${provider.name}...`)
      return await provider.fn(systemPrompt, userPrompt)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`${provider.name} failed: ${msg}`)
      errors.push(`${provider.name}: ${msg}`)
    }
  }

  throw new Error(
    errors.length > 0
      ? `All AI providers failed: ${errors.join('; ')}`
      : 'No AI API keys configured. Add GROK_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY to your .env file.'
  )
}

function parseStoryResponse(raw: string): { title: string; content: string; moral: string } {
  // Try to extract JSON from the response
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || 'A Magical Bedtime Story',
        content: parsed.content || raw,
        moral: parsed.moral || '',
      }
    } catch {
      // Fall through to plain text parsing
    }
  }

  // Fallback: treat as plain text
  const lines = raw.trim().split('\n')
  const title = lines[0]?.replace(/^#\s*/, '').replace(/^\*\*(.+)\*\*$/, '$1') || 'A Magical Bedtime Story'
  return {
    title,
    content: lines.slice(1).join('\n').trim() || raw,
    moral: '',
  }
}

export async function generateStoryHandler(req: Request, res: Response) {
  try {
    const formData: StoryFormData = req.body
    if (!formData.childName?.trim()) {
      res.status(400).json({ message: "Please provide your child's name" })
      return
    }

    const userPrompt = buildUserPrompt(formData)
    const rawResponse = await generateWithFallback(SYSTEM_PROMPT, userPrompt)
    const parsed = parseStoryResponse(rawResponse)

    const story = {
      id: `story_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title: parsed.title,
      content: parsed.content,
      moral: parsed.moral,
      formData,
      createdAt: new Date().toISOString(),
    }

    res.json(story)
  } catch (err) {
    console.error('Story generation error:', err)
    const message = err instanceof Error ? err.message : 'Failed to generate story'
    res.status(500).json({ message })
  }
}
