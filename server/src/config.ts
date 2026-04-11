import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse .env manually (no dotenv dependency)
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env')
    const lines = readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx)
      const val = trimmed.slice(eqIdx + 1)
      if (!process.env[key]) process.env[key] = val
    }
  } catch { /* .env is optional */ }
}

loadEnv()

export const BOT_TOKEN = process.env.BOT_TOKEN!
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
export const PORT = parseInt(process.env.PORT || '3001', 10)
