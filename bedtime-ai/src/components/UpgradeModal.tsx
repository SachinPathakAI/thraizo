import { useState } from 'react'
import { MONTHLY_PRICE, YEARLY_PRICE } from '../lib/types'
import { createCheckoutSession } from '../lib/api'
import { setPremium } from '../lib/storage'

interface UpgradeModalProps {
  onClose: () => void
}

export default function UpgradeModal({ onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async (priceType: 'monthly' | 'yearly') => {
    setLoading(priceType)
    setError(null)

    try {
      const url = await createCheckoutSession(priceType)
      if (url) {
        window.location.href = url
      } else {
        // Demo mode — unlock premium locally
        setPremium(true)
        onClose()
        window.location.reload()
      }
    } catch {
      // Fallback: demo mode activation
      setError('Stripe not configured. Activating demo premium mode...')
      setTimeout(() => {
        setPremium(true)
        onClose()
        window.location.reload()
      }, 1500)
    }
  }

  const yearlyMonthly = (YEARLY_PRICE / 12).toFixed(2)
  const savings = Math.round((1 - YEARLY_PRICE / (MONTHLY_PRICE * 12)) * 100)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade to Premium"
    >
      <div className="glass-card max-w-md w-full p-6 md:p-8 animate-slide-up border-dream-500/20">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✨</div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-dream-200 to-dream-100 bg-clip-text text-transparent">
            Unlock Unlimited Stories
          </h2>
          <p className="text-night-300 mt-2 text-sm">
            Give your child a new magical adventure every night
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {[
            'Unlimited stories every day',
            'All themes & moods',
            'Story history saved forever',
            'Priority story generation',
            'New features first',
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-night-200">
              <span className="text-dream-400">✓</span> {feature}
            </li>
          ))}
        </ul>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-dream-600/20 border border-dream-500/30 text-dream-200 text-sm text-center">
            {error}
          </div>
        )}

        {/* Pricing options */}
        <div className="space-y-3">
          <button
            onClick={() => handleCheckout('yearly')}
            disabled={loading !== null}
            className="w-full p-4 rounded-2xl border-2 border-dream-400/40 bg-dream-600/10
                       hover:bg-dream-600/20 transition-all group relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-dream-500 text-white text-xs font-bold rounded-full">
              SAVE {savings}%
            </div>
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-bold text-dream-100">Yearly</p>
                <p className="text-xs text-night-400">${yearlyMonthly}/mo billed annually</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-2xl text-dream-200">
                  ${YEARLY_PRICE}
                  <span className="text-sm text-night-400 font-normal">/yr</span>
                </p>
              </div>
            </div>
            {loading === 'yearly' && (
              <div className="mt-2 text-xs text-dream-300 animate-dreampulse">Processing...</div>
            )}
          </button>

          <button
            onClick={() => handleCheckout('monthly')}
            disabled={loading !== null}
            className="w-full p-4 rounded-2xl border border-night-600/40 bg-night-800/30
                       hover:bg-night-700/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-bold text-night-200">Monthly</p>
                <p className="text-xs text-night-400">Cancel anytime</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-2xl text-night-200">
                  ${MONTHLY_PRICE}
                  <span className="text-sm text-night-400 font-normal">/mo</span>
                </p>
              </div>
            </div>
            {loading === 'monthly' && (
              <div className="mt-2 text-xs text-dream-300 animate-dreampulse">Processing...</div>
            )}
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full mt-4 text-center text-sm text-night-400 hover:text-night-200 transition-colors py-2"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
