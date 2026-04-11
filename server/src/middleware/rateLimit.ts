import { Request, Response, NextFunction } from 'express'

const hits = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60_000  // 1 minute
const MAX_REQUESTS = 60   // 60 req/min per IP

// Clean old entries every 5 min
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of hits) {
    if (val.resetAt < now) hits.delete(key)
  }
}, 300_000)

export function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  const now = Date.now()

  let entry = hits.get(ip)
  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + WINDOW_MS }
    hits.set(ip, entry)
  }

  entry.count++

  if (entry.count > MAX_REQUESTS) {
    res.status(429).json({ error: 'Too many requests' })
    return
  }

  next()
}
