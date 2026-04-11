import { Router } from 'express'
import db from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'
import { tgApi } from '../tgApi.js'

const STARS_PRICE = 1000

const router = Router()
router.use(requireAuth)

/** Check subscription status */
router.get('/', (req, res) => {
  const row = db.prepare(
    'SELECT plan, expires_at FROM subscriptions WHERE user_id = ?'
  ).get(req.user!.userId) as { plan: string; expires_at: string | null } | undefined

  if (!row) {
    res.json({ plan: 'free', active: true })
    return
  }

  const active = row.plan === 'free' ||
    !row.expires_at ||
    new Date(row.expires_at) > new Date()

  res.json({ plan: row.plan, active, expiresAt: row.expires_at })
})

/** Create Stars invoice link */
router.post('/invoice', async (req, res) => {
  try {
    const payload = JSON.stringify({
      userId: req.user!.userId,
      telegramId: req.user!.telegramId,
    })

    const result = await tgApi('createInvoiceLink', {
      title: 'Полный доступ ОГЭ Математика',
      description: 'Доступ ко всем 25 заданиям на 30 дней',
      payload,
      currency: 'XTR',
      prices: [{ label: 'Полный доступ (30 дней)', amount: STARS_PRICE }],
    }) as { ok: boolean; result?: string; description?: string }

    if (!result.ok || !result.result) {
      console.error('createInvoiceLink failed:', result)
      res.status(500).json({ error: result.description || 'Failed to create invoice' })
      return
    }

    res.json({ invoiceLink: result.result })
  } catch (err) {
    console.error('Invoice creation error:', err)
    res.status(500).json({ error: 'Internal error' })
  }
})

export default router
