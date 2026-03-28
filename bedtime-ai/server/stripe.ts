import type { Request, Response } from 'express'

export async function createCheckoutHandler(req: Request, res: Response) {
  const { priceType } = req.body as { priceType: 'monthly' | 'yearly' }
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    // Demo mode — return null URL so frontend can activate demo premium
    console.log('Stripe not configured — returning demo mode')
    res.json({ url: null })
    return
  }

  const priceId =
    priceType === 'yearly'
      ? process.env.STRIPE_PRICE_YEARLY
      : process.env.STRIPE_PRICE_MONTHLY

  if (!priceId) {
    res.status(400).json({ message: `Stripe price ID not configured for ${priceType} plan` })
    return
  }

  try {
    // Use Stripe API directly instead of SDK to keep deps minimal
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'success_url': `${req.headers.origin || 'http://localhost:5173'}?upgraded=true`,
        'cancel_url': `${req.headers.origin || 'http://localhost:5173'}?cancelled=true`,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Stripe error: ${err}`)
    }

    const session = await response.json()
    res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    const message = err instanceof Error ? err.message : 'Failed to create checkout session'
    res.status(500).json({ message })
  }
}
