import { AppView, DAILY_FREE_LIMIT } from '../lib/types'

interface HeaderProps {
  view: AppView
  onNavigate: (view: AppView) => void
  remaining: number
  premium: boolean
  onUpgrade: () => void
}

export default function Header({ view, onNavigate, remaining, premium, onUpgrade }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-night-950/70 border-b border-night-700/30">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🌙</span>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-dream-300 to-dream-100 bg-clip-text text-transparent">
            DreamTales
          </h1>
        </button>

        <nav className="flex items-center gap-3">
          {/* Usage counter */}
          {!premium && (
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-night-200">
              <span className="text-dream-300">
                {Math.max(0, remaining)}/{DAILY_FREE_LIMIT}
              </span>
              <span className="text-night-400">stories left</span>
            </div>
          )}

          {premium && (
            <span className="hidden sm:inline-flex items-center gap-1 text-sm bg-dream-600/30 text-dream-200 px-3 py-1 rounded-full border border-dream-500/30">
              ✨ Premium
            </span>
          )}

          <button
            onClick={() => onNavigate(view === 'stories' ? 'home' : 'stories')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg
                       hover:bg-night-800/50 transition-colors text-night-200 hover:text-white"
          >
            <span>{view === 'stories' ? '✏️' : '📚'}</span>
            <span className="hidden sm:inline">{view === 'stories' ? 'New Story' : 'My Stories'}</span>
          </button>

          {!premium && (
            <button
              onClick={onUpgrade}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg
                         bg-gradient-to-r from-dream-500 to-dream-400 text-white font-semibold
                         hover:from-dream-400 hover:to-dream-300 transition-all shadow-lg shadow-dream-500/20"
            >
              <span>⭐</span>
              <span className="hidden sm:inline">Upgrade</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
