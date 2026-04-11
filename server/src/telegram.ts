import { createHmac, createHash } from 'crypto'
import { BOT_TOKEN } from './config.js'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
}

/**
 * Verify Telegram WebApp initData signature.
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyInitData(initData: string): TelegramUser | null {
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null

  params.delete('hash')
  const entries = [...params.entries()].sort(([a], [b]) => a.localeCompare(b))
  const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join('\n')

  const secretKey = createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
  const computed = createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  if (computed !== hash) return null

  const authDate = parseInt(params.get('auth_date') || '0', 10)
  const now = Math.floor(Date.now() / 1000)
  if (now - authDate > 86400) return null

  const userStr = params.get('user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr) as TelegramUser
  } catch {
    return null
  }
}

/**
 * Verify Telegram Login Widget data (for website auth).
 * https://core.telegram.org/widgets/login#checking-authorization
 */
export function verifyLoginWidget(data: Record<string, string>): TelegramUser | null {
  const { hash, ...rest } = data
  if (!hash) return null

  const checkString = Object.keys(rest)
    .sort()
    .map(k => `${k}=${rest[k]}`)
    .join('\n')

  const secretKey = createHash('sha256').update(BOT_TOKEN).digest()
  const computed = createHmac('sha256', secretKey).update(checkString).digest('hex')

  if (computed !== hash) return null

  const authDate = parseInt(rest['auth_date'] || '0', 10)
  const now = Math.floor(Date.now() / 1000)
  if (now - authDate > 86400) return null

  return {
    id: parseInt(rest['id'], 10),
    first_name: rest['first_name'] || '',
    last_name: rest['last_name'],
    username: rest['username'],
  }
}
