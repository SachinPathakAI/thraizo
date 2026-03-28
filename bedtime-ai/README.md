# 🌙 DreamTales — AI Bedtime Stories

Personalized AI bedtime stories for your little ones. Magical, calming, and tailored to your child.

## Quick Start

```bash
cd bedtime-ai
npm install

# Copy and configure environment
cp .env.example .env
# Add your OpenAI API key (required), plus optional Lemon Squeezy keys for payments

# Start the API server
npm run server

# In another terminal, start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and create your first story!

## Features

- **Personalized Stories** — Name, age, interests, pets, mood, and theme
- **AI-Powered** — OpenAI (primary), with xAI Grok and Anthropic as fallback
- **Read-Along** — Word highlighting synced with narration
- **Audio Narration** — Browser SpeechSynthesis with speed control
- **Sleep Sounds** — Rain, ocean, white noise ambient backgrounds
- **Story Library** — Save and revisit favorite stories
- **Freemium** — 3 free stories/day, then $4.99/mo or $49/yr unlimited
- **Mobile-First** — Responsive, soothing dark theme

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (custom dream theme)
- Express API server
- Lemon Squeezy for payments
- Web Audio API for sleep sounds
- SpeechSynthesis API for narration

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add your API keys as environment variables in the Vercel dashboard.

## Environment Variables

See `.env.example` for all configuration options.
