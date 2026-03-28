import express from 'express'
import cors from 'cors'
import { generateStoryHandler } from './story'
import { createCheckoutHandler } from './stripe'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.post('/api/generate-story', generateStoryHandler)
app.post('/api/create-checkout', createCheckoutHandler)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🌙 DreamTales API running on http://localhost:${PORT}`)
})
