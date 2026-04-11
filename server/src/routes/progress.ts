import { Router } from 'express'
import db from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

/** Get progress for a topic */
router.get('/:topicId', (req, res) => {
  const { topicId } = req.params
  const row = db.prepare(
    'SELECT data FROM progress WHERE user_id = ? AND topic_id = ?'
  ).get(req.user!.userId, topicId) as { data: string } | undefined

  res.json({ progress: row ? JSON.parse(row.data) : null })
})

/** Get all progress */
router.get('/', (req, res) => {
  const rows = db.prepare(
    'SELECT topic_id, data FROM progress WHERE user_id = ?'
  ).all(req.user!.userId) as { topic_id: string; data: string }[]

  const result: Record<string, unknown> = {}
  for (const row of rows) {
    result[row.topic_id] = JSON.parse(row.data)
  }
  res.json({ progress: result })
})

/** Save progress for a topic */
router.put('/:topicId', (req, res) => {
  const { topicId } = req.params
  const { data } = req.body

  if (!data || typeof data !== 'object') {
    res.status(400).json({ error: 'data object required' })
    return
  }

  db.prepare(`
    INSERT INTO progress (user_id, topic_id, data, updated_at)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(user_id, topic_id) DO UPDATE SET
      data = excluded.data,
      updated_at = datetime('now')
  `).run(req.user!.userId, topicId, JSON.stringify(data))

  res.json({ ok: true })
})

export default router
