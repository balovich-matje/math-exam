import { Router } from 'express'
import db from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'

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

export default router
