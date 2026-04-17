import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { authTelegram, getToken, fetchSubscription } from './api'
import { getInitData } from './telegram'
import { syncProgressFromServer } from './blockStorage'

interface AuthState {
  ready: boolean
  authenticated: boolean
  plan: 'free' | 'paid'
  error: string | null
  refreshPlan: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  ready: false,
  authenticated: false,
  plan: 'free',
  error: null,
  refreshPlan: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    ready: false,
    authenticated: !!getToken(),
    plan: 'free',
    error: null,
    refreshPlan: async () => {},
  })

  const refreshPlan = useCallback(async () => {
    try {
      const sub = await fetchSubscription()
      const plan = sub.plan !== 'free' && sub.active ? 'paid' as const : 'free' as const
      setState(prev => ({ ...prev, plan }))
    } catch {}
  }, [])

  useEffect(() => {
    async function init() {
      // Step 1: authenticate
      if (!getToken()) {
        const initData = getInitData()
        if (initData) {
          try {
            await authTelegram(initData)
          } catch (err: any) {
            setState(prev => ({ ...prev, ready: true, authenticated: false, plan: 'free', error: err.message, refreshPlan }))
            return
          }
        } else {
          // Not in Telegram — anonymous, free only
          setState(prev => ({ ...prev, ready: true, authenticated: false, plan: 'free', error: null, refreshPlan }))
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
      setState({ ready: true, authenticated: true, plan, error: null, refreshPlan })
    }

    init()
  }, [refreshPlan])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

/** Topics 1-6 are free, 7+ require paid subscription */
export function isTopicFree(topicNumber: string): boolean {
  const num = parseInt(topicNumber, 10)
  return num >= 1 && num <= 6
}
