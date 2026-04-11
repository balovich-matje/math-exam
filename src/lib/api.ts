const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

let token: string | null = localStorage.getItem('auth_token')

export function setToken(t: string) {
  token = t
  localStorage.setItem('auth_token', t)
}

export function getToken(): string | null {
  return token
}

export function clearToken() {
  token = null
  localStorage.removeItem('auth_token')
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── Auth ──

export async function authTelegram(initData: string) {
  const data = await request<{ token: string; user: { id: number; telegramId: number; firstName: string } }>(
    '/auth/telegram',
    { method: 'POST', body: JSON.stringify({ initData }) }
  )
  setToken(data.token)
  return data
}

// ── Progress ──

export async function fetchProgress(topicId: string) {
  return request<{ progress: unknown }>(`/progress/${topicId}`)
}

export async function fetchAllProgress() {
  return request<{ progress: Record<string, unknown> }>('/progress')
}

export async function saveProgress(topicId: string, data: unknown) {
  return request<{ ok: boolean }>(`/progress/${topicId}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  })
}

// ── Subscription ──

export async function fetchSubscription() {
  return request<{ plan: string; active: boolean; expiresAt?: string }>('/subscription')
}

export async function createInvoiceLink() {
  return request<{ invoiceLink: string }>('/subscription/invoice', { method: 'POST' })
}
