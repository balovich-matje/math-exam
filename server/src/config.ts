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

const NODE_ENV = process.env.NODE_ENV || 'development'
const isDev = NODE_ENV === 'development'

function requireEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (value) return value

  if (!isDev) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return ''
}

export const BOT_TOKEN = requireEnv('BOT_TOKEN')
export const JWT_SECRET = process.env.JWT_SECRET?.trim() || (isDev ? 'dev-secret' : requireEnv('JWT_SECRET'))
export const PORT = parseInt(process.env.PORT || '3001', 10)
