import { Router } from 'express'
import db from '../db/index.js'
import { verifyInitData, verifyLoginWidget } from '../telegram.js'
import { signToken } from '../middleware/auth.js'

// Telegram IDs that always get free paid access (teacher, etc.)
const VIP_TELEGRAM_IDS = [1140188757]

const router = Router()

/** Authenticate via Telegram Mini App initData */
router.post('/telegram', (req, res) => {
  const { initData } = req.body
  if (!initData || typeof initData !== 'string') {
    res.status(400).json({ error: 'initData required' })
    return
  }

  const tgUser = verifyInitData(initData)
  if (!tgUser) {
    res.status(401).json({ error: 'Invalid initData' })
    return
  }

  const user = upsertUser(tgUser.id, tgUser.first_name, tgUser.last_name || '', tgUser.username || '')
  const token = signToken({ userId: user.id, telegramId: tgUser.id })

  res.json({ token, user: { id: user.id, telegramId: tgUser.id, firstName: tgUser.first_name } })
})

/** Authenticate via Telegram Login Widget (website) */
router.post('/telegram-widget', (req, res) => {
  const data = req.body
  if (!data || !data.hash) {
    res.status(400).json({ error: 'Login data required' })
    return
  }

  const tgUser = verifyLoginWidget(data)
  if (!tgUser) {
    res.status(401).json({ error: 'Invalid login data' })
    return
  }

  const user = upsertUser(tgUser.id, tgUser.first_name, tgUser.last_name || '', tgUser.username || '')
  const token = signToken({ userId: user.id, telegramId: tgUser.id })

  res.json({ token, user: { id: user.id, telegramId: tgUser.id, firstName: tgUser.first_name } })
})

function upsertUser(telegramId: number, firstName: string, lastName: string, username: string) {
  const stmt = db.prepare(`
    INSERT INTO users (telegram_id, first_name, last_name, username)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(telegram_id) DO UPDATE SET
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      username = excluded.username,
      last_seen_at = datetime('now')
    RETURNING id
  `)
  const user = stmt.get(telegramId, firstName, lastName, username) as { id: number }

  // Auto-grant VIP users permanent paid access
  if (VIP_TELEGRAM_IDS.includes(telegramId)) {
    db.prepare(`
      INSERT INTO subscriptions (user_id, plan, expires_at)
      VALUES (?, 'paid', '2099-12-31T23:59:59.000Z')
      ON CONFLICT(user_id) DO UPDATE SET plan = 'paid', expires_at = '2099-12-31T23:59:59.000Z'
    `).run(user.id)
  }

  return user
}

export default router
