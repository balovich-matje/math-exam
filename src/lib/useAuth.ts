import { useState, useEffect } from 'react'
import { authTelegram, getToken } from './api'
import { getInitData } from './telegram'

interface AuthState {
  ready: boolean
  authenticated: boolean
  error: string | null
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    ready: false,
    authenticated: !!getToken(),
    error: null,
  })

  useEffect(() => {
    // Already have a token from a previous session
    if (getToken()) {
      setState({ ready: true, authenticated: true, error: null })
      return
    }

    // Try Telegram Mini App auth
    const initData = getInitData()
    if (initData) {
      authTelegram(initData)
        .then(() => setState({ ready: true, authenticated: true, error: null }))
        .catch(err => setState({ ready: true, authenticated: false, error: err.message }))
    } else {
      // Not in Telegram — allow anonymous (free tier only)
      setState({ ready: true, authenticated: false, error: null })
    }
  }, [])

  return state
}
