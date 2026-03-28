import { useState } from 'react'
import { Story } from '../lib/types'
import { getStories, deleteStory } from '../lib/storage'

interface MyStoriesProps {
  onViewStory: (story: Story) => void
  onStoriesChange: () => void
}

export default function MyStories({ onViewStory, onStoriesChange }: MyStoriesProps) {
  const [stories, setStories] = useState<Story[]>(getStories)

  const handleDelete = (id: string) => {
    deleteStory(id)
    setStories(getStories())
    onStoriesChange()
  }

  return (
    <div className="mt-6 animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-dream-200 to-dream-100 bg-clip-text text-transparent">
          📚 My Stories
        </h2>
        <p className="text-night-400 mt-2">
          {stories.length === 0
            ? 'No stories yet — create your first magical tale!'
            : `${stories.length} ${stories.length === 1 ? 'story' : 'stories'} in your collection`}
        </p>
      </div>

      {stories.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">🌟</div>
          <p className="text-night-300 text-lg">Your story library is empty</p>
          <p className="text-night-400 text-sm mt-2">Generate your first bedtime story to get started!</p>
        </div>
      )}

      <div className="grid gap-4">
        {stories.map((story, idx) => (
          <div
            key={story.id}
            className="glass-card p-5 hover:border-dream-400/30 transition-all cursor-pointer group"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-start justify-between gap-4">
              <button
                onClick={() => onViewStory(story)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">
                    {story.formData.mood === 'Adventurous' ? '🌟' :
                     story.formData.mood === 'Silly' ? '🎉' :
                     story.formData.mood === 'Magical' ? '🧙' :
                     story.formData.mood === 'Calm' ? '🦋' :
                     story.formData.mood === 'Hopeful' ? '🌈' : '😴'}
                  </span>
                  <div>
                    <h3 className="font-bold text-dream-100 group-hover:text-dream-200 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs text-night-400">
                      For {story.formData.childName} · {new Date(story.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-night-300 text-sm line-clamp-2">
                  {story.content.substring(0, 150)}...
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-dream-600/20 text-dream-300 border border-dream-500/20">
                    {story.formData.theme}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-night-700/40 text-night-300">
                    Age {story.formData.age}
                  </span>
                </div>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(story.id) }}
                className="p-2 text-night-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Delete ${story.title}`}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
