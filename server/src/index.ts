import express from 'express'
import cors from 'cors'
import { PORT } from './config.js'
import { rateLimit } from './middleware/rateLimit.js'
import authRoutes from './routes/auth.js'
import progressRoutes from './routes/progress.js'
import subscriptionRoutes from './routes/subscription.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(rateLimit)

// Routes
app.use('/auth', authRoutes)
app.use('/progress', progressRoutes)
app.use('/subscription', subscriptionRoutes)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

import { startPolling } from './bot.js'

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  startPolling()
})
