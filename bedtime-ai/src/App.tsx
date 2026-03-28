import { useState, useCallback } from 'react'
import { AppView, Story, StoryFormData, DAILY_FREE_LIMIT } from './lib/types'
import { getUsageToday, incrementUsage, isPremium, saveStory } from './lib/storage'
import { generateStory } from './lib/api'
import Header from './components/Header'
import StoryForm from './components/StoryForm'
import StoryDisplay from './components/StoryDisplay'
import MyStories from './components/MyStories'
import UpgradeModal from './components/UpgradeModal'
import Stars from './components/Stars'
import LoadingState from './components/LoadingState'

export default function App() {
  const [view, setView] = useState<AppView>('home')
  const [currentStory, setCurrentStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [storiesVersion, setStoriesVersion] = useState(0)

  const usage = getUsageToday()
  const premium = isPremium()
  const remaining = premium ? Infinity : DAILY_FREE_LIMIT - usage.count

  const handleGenerate = useCallback(async (formData: StoryFormData) => {
    if (!premium && remaining <= 0) {
      setShowUpgrade(true)
      return
    }

    setError(null)
    setView('generating')

    try {
      const story = await generateStory(formData)
      saveStory(story)
      incrementUsage()
      setCurrentStory(story)
      setStoriesVersion((v) => v + 1)
      setView('home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setView('home')
    }
  }, [premium, remaining])

  const handleViewStory = useCallback((story: Story) => {
    setCurrentStory(story)
    setView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen dream-gradient relative overflow-hidden">
      <Stars />

      <div className="relative z-10">
        <Header
          view={view}
          onNavigate={setView}
          remaining={remaining}
          premium={premium}
          onUpgrade={() => setShowUpgrade(true)}
        />

        <main className="max-w-4xl mx-auto px-4 pb-20">
          {view === 'generating' && <LoadingState />}

          {view === 'home' && (
            <div className="animate-slide-up">
              {error && (
                <div className="mb-6 p-4 glass-card border-red-500/30 text-red-300 rounded-xl" role="alert">
                  <p className="font-semibold">Oops! {error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm underline hover:text-red-200"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {currentStory ? (
                <StoryDisplay
                  story={currentStory}
                  onBack={() => setCurrentStory(null)}
                />
              ) : (
                <StoryForm
                  onGenerate={handleGenerate}
                  remaining={remaining}
                  premium={premium}
                />
              )}
            </div>
          )}

          {view === 'stories' && (
            <MyStories
              key={storiesVersion}
              onViewStory={handleViewStory}
              onStoriesChange={() => setStoriesVersion((v) => v + 1)}
            />
          )}
        </main>
      </div>

      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  )
}
