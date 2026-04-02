declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
          offClick: (cb: () => void) => void
          enable: () => void
          disable: () => void
          setText: (text: string) => void
        }
        BackButton: {
          isVisible: boolean
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
          offClick: (cb: () => void) => void
        }
        initDataUnsafe: {
          user?: {
            first_name: string
            last_name?: string
            username?: string
          }
        }
        themeParams: Record<string, string>
      }
    }
  }
}

export function getTelegram() {
  return window.Telegram?.WebApp
}

export function getUserName(): string {
  return getTelegram()?.initDataUnsafe?.user?.first_name ?? 'Ученик'
}

export function initTelegram() {
  const tg = getTelegram()
  if (tg) {
    tg.ready()
    tg.expand()
  }
}
