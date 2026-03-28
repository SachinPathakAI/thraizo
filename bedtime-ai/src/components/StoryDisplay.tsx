import { useState } from 'react'
import { Story } from '../lib/types'
import AudioPlayer from './AudioPlayer'

interface StoryDisplayProps {
  story: Story
  onBack: () => void
}

export default function StoryDisplay({ story, onBack }: StoryDisplayProps) {
  const [highlightIndex, setHighlightIndex] = useState(-1)

  const words = story.content.split(/(\s+)/)
  const paragraphs = story.content.split('\n\n')

  return (
    <div className="mt-6 space-y-6 animate-slide-up">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-night-300 hover:text-dream-300 transition-colors text-sm"
      >
        <span>←</span> New Story
      </button>

      {/* Story header */}
      <div className="text-center">
        <div className="text-5xl mb-3">📖</div>
        <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-dream-200 to-dream-100 bg-clip-text text-transparent">
          {story.title}
        </h2>
        <p className="text-night-400 text-sm mt-2">
          A story for {story.formData.childName}, age {story.formData.age}
        </p>
      </div>

      {/* Story content */}
      <div className="glass-card p-6 md:p-8">
        <div className="prose prose-invert max-w-none text-night-100 leading-relaxed text-lg" aria-live="polite">
          {paragraphs.map((paragraph, pIdx) => (
            <p key={pIdx} className="mb-4 last:mb-0">
              {highlightIndex >= 0
                ? paragraph.split(/(\s+)/).map((word, wIdx) => {
                    const globalIdx = words.indexOf(word, wIdx)
                    const isHighlighted = globalIdx === highlightIndex
                    return (
                      <span
                        key={wIdx}
                        className={isHighlighted ? 'word-highlight' : ''}
                      >
                        {word}
                      </span>
                    )
                  })
                : paragraph}
            </p>
          ))}
        </div>

        {/* Moral */}
        {story.moral && (
          <div className="mt-6 pt-4 border-t border-night-600/30">
            <p className="text-dream-300 text-sm italic flex items-center gap-2">
              <span>💫</span> {story.moral}
            </p>
          </div>
        )}
      </div>

      {/* Audio player */}
      <AudioPlayer
        text={story.content}
        onWordChange={setHighlightIndex}
      />

      {/* Story metadata */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-night-400">
        <span>🎭 {story.formData.mood}</span>
        <span>•</span>
        <span>🎨 {story.formData.theme}</span>
        <span>•</span>
        <span>📅 {new Date(story.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
