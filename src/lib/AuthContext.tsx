import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authTelegram, getToken, fetchSubscription } from './api'
import { getInitData } from './telegram'
import { syncProgressFromServer } from './blockStorage'

interface AuthState {
  ready: boolean
  authenticated: boolean
  plan: 'free' | 'paid'
  error: string | null
}

const AuthContext = createContext<AuthState>({
  ready: false,
  authenticated: false,
  plan: 'free',
  error: null,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    ready: false,
    authenticated: !!getToken(),
    plan: 'free',
    error: null,
  })

  useEffect(() => {
    async function init() {
      // Step 1: authenticate
      if (!getToken()) {
        const initData = getInitData()
        if (initData) {
          try {
            await authTelegram(initData)
          } catch (err: any) {
            setState({ ready: true, authenticated: false, plan: 'free', error: err.message })
            return
          }
        } else {
          // Not in Telegram — anonymous, free only
          setState({ ready: true, authenticated: false, plan: 'free', error: null })
          return
        }
      }

      // Step 2: sync progress from server + check subscription
      const [sub] = await Promise.allSettled([
        fetchSubscription(),
        syncProgressFromServer(),
      ])

      const plan = sub.status === 'fulfilled' && sub.value.plan !== 'free' && sub.value.active
        ? 'paid' as const
        : 'free' as const
      setState({ ready: true, authenticated: true, plan, error: null })
    }

    init()
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

/** Topics 1-5 are free, 6+ require paid subscription */
export function isTopicFree(topicNumber: string): boolean {
  const num = parseInt(topicNumber, 10)
  return num >= 1 && num <= 5
}
