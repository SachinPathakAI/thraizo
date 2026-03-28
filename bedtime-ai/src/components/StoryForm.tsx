import { useState } from 'react'
import { StoryFormData, MOODS, THEMES, DAILY_FREE_LIMIT } from '../lib/types'

interface StoryFormProps {
  onGenerate: (data: StoryFormData) => void
  remaining: number
  premium: boolean
}

export default function StoryForm({ onGenerate, remaining, premium }: StoryFormProps) {
  const [form, setForm] = useState<StoryFormData>({
    childName: '',
    age: 5,
    interests: '',
    familyPets: '',
    photoUrl: '',
    mood: 'Sleepy',
    theme: 'Moonlit Journey',
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const update = (field: keyof StoryFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setPhotoPreview(result)
        update('photoUrl', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.childName.trim()) return
    onGenerate(form)
  }

  const canGenerate = form.childName.trim() && (premium || remaining > 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      {/* Hero section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
          <span className="bg-gradient-to-r from-dream-200 via-dream-300 to-night-200 bg-clip-text text-transparent">
            Create a Magical Story
          </span>
        </h2>
        <p className="text-night-300 text-lg">
          Tell us about your little one and we'll craft a personalized bedtime tale ✨
        </p>
      </div>

      <div className="glass-card p-6 md:p-8 space-y-6">
        {/* Name & Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="childName" className="block text-sm font-semibold text-dream-200 mb-1.5">
              Child's Name <span className="text-dream-400">*</span>
            </label>
            <input
              id="childName"
              type="text"
              value={form.childName}
              onChange={(e) => update('childName', e.target.value)}
              placeholder="e.g., Luna"
              required
              className="w-full px-4 py-3 bg-night-900/60 border border-night-600/40 rounded-xl
                         text-white placeholder-night-400 focus:outline-none focus:ring-2
                         focus:ring-dream-400/50 focus:border-dream-400/50 transition-all"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-semibold text-dream-200 mb-1.5">
              Age: <span className="text-dream-300 text-lg">{form.age}</span>
            </label>
            <input
              id="age"
              type="range"
              min={3}
              max={12}
              value={form.age}
              onChange={(e) => update('age', Number(e.target.value))}
              className="w-full mt-2 accent-dream-400 h-2 bg-night-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-night-400 mt-1">
              <span>3</span>
              <span>12</span>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label htmlFor="interests" className="block text-sm font-semibold text-dream-200 mb-1.5">
            Interests & Hobbies
          </label>
          <input
            id="interests"
            type="text"
            value={form.interests}
            onChange={(e) => update('interests', e.target.value)}
            placeholder="e.g., dinosaurs, painting, soccer, space"
            className="w-full px-4 py-3 bg-night-900/60 border border-night-600/40 rounded-xl
                       text-white placeholder-night-400 focus:outline-none focus:ring-2
                       focus:ring-dream-400/50 focus:border-dream-400/50 transition-all"
          />
        </div>

        {/* Family & Pets */}
        <div>
          <label htmlFor="familyPets" className="block text-sm font-semibold text-dream-200 mb-1.5">
            Family Members & Pets
          </label>
          <input
            id="familyPets"
            type="text"
            value={form.familyPets}
            onChange={(e) => update('familyPets', e.target.value)}
            placeholder="e.g., sister Maya, golden retriever named Buddy"
            className="w-full px-4 py-3 bg-night-900/60 border border-night-600/40 rounded-xl
                       text-white placeholder-night-400 focus:outline-none focus:ring-2
                       focus:ring-dream-400/50 focus:border-dream-400/50 transition-all"
          />
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-semibold text-dream-200 mb-1.5">
            Photo (optional, for illustration inspiration)
          </label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-night-900/60 border border-dashed
                              border-night-500/40 rounded-xl hover:border-dream-400/50 transition-colors text-night-300">
                <span>📷</span>
                <span className="text-sm">Upload photo or paste URL</span>
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoFile} className="hidden" />
            </label>
            {photoPreview && (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-dream-400/30"
                />
                <button
                  type="button"
                  onClick={() => { setPhotoPreview(null); update('photoUrl', '') }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center"
                >
                  x
                </button>
              </div>
            )}
          </div>
          {!photoPreview && (
            <input
              type="url"
              value={form.photoUrl}
              onChange={(e) => { update('photoUrl', e.target.value); setPhotoPreview(e.target.value) }}
              placeholder="Or paste image URL..."
              className="w-full mt-2 px-4 py-2 bg-night-900/60 border border-night-600/40 rounded-xl
                         text-white placeholder-night-400 focus:outline-none focus:ring-2
                         focus:ring-dream-400/50 text-sm transition-all"
            />
          )}
        </div>

        {/* Mood */}
        <div>
          <label className="block text-sm font-semibold text-dream-200 mb-2">
            Tonight's Mood
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.label}
                type="button"
                onClick={() => update('mood', m.label)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${form.mood === m.label
                    ? 'bg-dream-500/40 border-dream-400/60 text-dream-100 shadow-lg shadow-dream-500/20'
                    : 'bg-night-800/40 border-night-600/30 text-night-300 hover:bg-night-700/40'
                  } border`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-semibold text-dream-200 mb-2">
            Story Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => update('theme', t.label)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-center
                  ${form.theme === t.label
                    ? 'bg-dream-500/40 border-dream-400/60 text-dream-100 shadow-lg shadow-dream-500/20'
                    : 'bg-night-800/40 border-night-600/30 text-night-300 hover:bg-night-700/40'
                  } border`}
              >
                <span className="text-lg">{t.emoji}</span>
                <br />
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="text-center space-y-3">
        <button
          type="submit"
          disabled={!canGenerate}
          className="dream-btn text-lg px-10 py-4 rounded-2xl animate-glow"
        >
          ✨ Generate Bedtime Story
        </button>
        {!premium && (
          <p className="text-night-400 text-sm">
            {remaining > 0
              ? `${remaining} of ${DAILY_FREE_LIMIT} free stories remaining today`
              : "You've used all free stories today — upgrade for unlimited!"}
          </p>
        )}
      </div>
    </form>
  )
}
