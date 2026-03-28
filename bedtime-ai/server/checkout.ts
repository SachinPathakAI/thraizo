import type { Request, Response } from 'express'

export async function createCheckoutHandler(req: Request, res: Response) {
  const { priceType } = req.body as { priceType: 'monthly' | 'yearly' }
  const apiKey = process.env.LEMONSQUEEZY_API_KEY
  const storeId = process.env.LEMONSQUEEZY_STORE_ID

  if (!apiKey || !storeId) {
    // Demo mode — return null URL so frontend can activate demo premium
    console.log('Lemon Squeezy not configured — returning demo mode')
    res.json({ url: null })
    return
  }

  const variantId =
    priceType === 'yearly'
      ? process.env.LEMONSQUEEZY_VARIANT_YEARLY
      : process.env.LEMONSQUEEZY_VARIANT_MONTHLY

  if (!variantId) {
    res.status(400).json({ message: `Lemon Squeezy variant ID not configured for ${priceType} plan` })
    return
  }

  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                plan: priceType,
              },
            },
            product_options: {
              redirect_url: `${req.headers.origin || 'http://localhost:5173'}?upgraded=true`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: storeId,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              },
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Lemon Squeezy error: ${err}`)
    }

    const result = await response.json()
    const checkoutUrl = result.data.attributes.url
    res.json({ url: checkoutUrl })
  } catch (err) {
    console.error('Lemon Squeezy checkout error:', err)
    const message = err instanceof Error ? err.message : 'Failed to create checkout session'
    res.status(500).json({ message })
  }
}
