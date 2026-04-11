import { BOT_TOKEN } from './config.js'

const API = `https://api.telegram.org/bot${BOT_TOKEN}`

export async function tgApi(method: string, body?: Record<string, unknown>) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}
