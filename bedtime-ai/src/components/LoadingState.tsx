export default function LoadingState() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center text-center animate-slide-up">
      <div className="relative mb-8">
        {/* Spinning moon */}
        <div className="text-7xl animate-float">🌙</div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-dream-500/20 rounded-full blur-sm" />
      </div>

      <h2 className="text-2xl font-bold text-dream-200 mb-2">
        Crafting Your Dream...
      </h2>

      <p className="text-night-300 max-w-md animate-dreampulse">
        Our story wizards are weaving a magical tale just for your little one. This usually takes about 10 seconds...
      </p>

      {/* Animated dots */}
      <div className="flex gap-2 mt-6">
        {['✨', '🌟', '⭐'].map((star, i) => (
          <span
            key={i}
            className="text-2xl animate-twinkle"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            {star}
          </span>
        ))}
      </div>

      {/* Fun loading messages */}
      <div className="mt-8 space-y-2 text-sm text-night-400">
        <p className="animate-dreampulse" style={{ animationDelay: '0s' }}>
          🧚 Sprinkling fairy dust on the words...
        </p>
        <p className="animate-dreampulse" style={{ animationDelay: '2s' }}>
          📝 Making sure the dragons are friendly...
        </p>
        <p className="animate-dreampulse" style={{ animationDelay: '4s' }}>
          🌈 Adding extra sparkle to the ending...
        </p>
      </div>
    </div>
  )
}
