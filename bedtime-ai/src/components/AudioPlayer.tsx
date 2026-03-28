import { useState, useEffect, useRef, useCallback } from 'react'

interface AudioPlayerProps {
  text: string
  onWordChange: (index: number) => void
}

type SleepSound = 'none' | 'rain' | 'ocean' | 'whitenoise'

const SLEEP_SOUNDS: { id: SleepSound; label: string; emoji: string }[] = [
  { id: 'none', label: 'None', emoji: '🔇' },
  { id: 'rain', label: 'Rain', emoji: '🌧️' },
  { id: 'ocean', label: 'Ocean', emoji: '🌊' },
  { id: 'whitenoise', label: 'White Noise', emoji: '☁️' },
]

// Generate ambient noise using Web Audio API
function createNoiseGenerator(ctx: AudioContext, type: SleepSound): AudioNode | null {
  if (type === 'none') return null

  const bufferSize = 2 * ctx.sampleRate
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true

  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  gain.gain.value = 0.08

  if (type === 'rain') {
    filter.type = 'highpass'
    filter.frequency.value = 1000
    gain.gain.value = 0.06
  } else if (type === 'ocean') {
    filter.type = 'lowpass'
    filter.frequency.value = 400
    gain.gain.value = 0.1
  } else {
    filter.type = 'lowpass'
    filter.frequency.value = 2000
    gain.gain.value = 0.05
  }

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start()

  return source
}

export default function AudioPlayer({ text, onWordChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(0.85)
  const [sleepSound, setSleepSound] = useState<SleepSound>('none')
  const [showSounds, setShowSounds] = useState(false)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const noiseRef = useRef<AudioNode | null>(null)

  const stopNoise = useCallback(() => {
    if (noiseRef.current && 'stop' in noiseRef.current) {
      (noiseRef.current as AudioBufferSourceNode).stop()
    }
    noiseRef.current = null
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }
  }, [])

  const startNoise = useCallback((type: SleepSound) => {
    stopNoise()
    if (type === 'none') return
    const ctx = new AudioContext()
    audioCtxRef.current = ctx
    noiseRef.current = createNoiseGenerator(ctx, type)
  }, [stopNoise])

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      stopNoise()
    }
  }, [stopNoise])

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsPlaying(true)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = speed
    utterance.pitch = 0.9
    utterance.volume = 1

    // Pick a soothing voice
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(
      (v) =>
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('karen') ||
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('google uk english female')
    )
    if (preferred) utterance.voice = preferred

    let wordIndex = 0
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        onWordChange(wordIndex)
        wordIndex++
      }
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      onWordChange(-1)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
      onWordChange(-1)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
    setIsPaused(false)

    if (sleepSound !== 'none') startNoise(sleepSound)
  }

  const handlePause = () => {
    window.speechSynthesis.pause()
    setIsPaused(true)
    setIsPlaying(false)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    onWordChange(-1)
    stopNoise()
  }

  const handleSleepSoundChange = (sound: SleepSound) => {
    setSleepSound(sound)
    if (isPlaying || isPaused) {
      startNoise(sound)
    }
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    // Speed changes apply on next play
  }

  return (
    <div className="glass-card p-5">
      <div className="flex flex-col gap-4">
        {/* Main controls */}
        <div className="flex items-center justify-center gap-4">
          {!isPlaying && !isPaused && (
            <button
              onClick={handlePlay}
              className="dream-btn text-lg px-8 py-3 rounded-2xl flex items-center gap-2"
              aria-label="Play story"
            >
              <span className="text-2xl">▶️</span> Listen to Story
            </button>
          )}

          {isPlaying && (
            <button
              onClick={handlePause}
              className="dream-btn px-6 py-3 rounded-2xl flex items-center gap-2"
              aria-label="Pause"
            >
              <span className="text-xl">⏸️</span> Pause
            </button>
          )}

          {isPaused && (
            <button
              onClick={handlePlay}
              className="dream-btn px-6 py-3 rounded-2xl flex items-center gap-2"
              aria-label="Resume"
            >
              <span className="text-xl">▶️</span> Resume
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              onClick={handleStop}
              className="px-4 py-3 rounded-2xl border border-night-600/40 text-night-300
                         hover:bg-night-800/40 transition-colors"
              aria-label="Stop"
            >
              ⏹️
            </button>
          )}
        </div>

        {/* Speed & Sound controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {/* Speed */}
          <div className="flex items-center gap-2">
            <span className="text-night-400">🐢</span>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={speed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="w-24 accent-dream-400 h-1.5 bg-night-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Reading speed"
            />
            <span className="text-night-400">🐇</span>
            <span className="text-night-400 text-xs w-10">{speed.toFixed(2)}x</span>
          </div>

          {/* Sleep sounds toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSounds(!showSounds)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs
                ${sleepSound !== 'none'
                  ? 'border-dream-400/40 bg-dream-600/20 text-dream-200'
                  : 'border-night-600/40 text-night-300 hover:bg-night-800/40'
                }`}
            >
              <span>🎵</span> Sleep Sounds
            </button>

            {showSounds && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-night-800 border border-night-600/40
                              rounded-xl p-2 shadow-xl min-w-[140px] z-10">
                {SLEEP_SOUNDS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { handleSleepSoundChange(s.id); setShowSounds(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors
                      ${sleepSound === s.id
                        ? 'bg-dream-500/30 text-dream-200'
                        : 'text-night-300 hover:bg-night-700/40'
                      }`}
                  >
                    <span>{s.emoji}</span> {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
