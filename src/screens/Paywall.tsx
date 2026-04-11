import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createInvoiceLink } from '../lib/api'
import { getTelegram } from '../lib/telegram'
import { useAuth } from '../lib/AuthContext'

type PaymentState = 'idle' | 'creating' | 'pending' | 'success' | 'cancelled' | 'failed'

function PendingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
      {/* Animated spinner with pulse ring */}
      <div className="relative mb-8">
        <div
          className="absolute inset-0 w-24 h-24 rounded-full bg-tg-button/20"
          style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}
        />
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-full border-4 border-tg-hint/20 border-t-tg-button"
            style={{ animation: 'spin-slow 1s linear infinite' }}
          />
          <span className="absolute text-2xl">⭐</span>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2 text-center">Ждём подтверждение оплаты</h2>
      <p className="text-tg-hint text-center text-sm mb-2">
        Завершите оплату в окне Telegram
      </p>

      {/* Shimmer bar */}
      <div className="w-48 h-1.5 rounded-full overflow-hidden mt-4">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, var(--tg-theme-button-color, #2563eb) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  )
}

function SuccessScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
      <div
        className="text-6xl mb-6"
        style={{ animation: 'bounce-in 0.5s ease-out' }}
      >
        ✅
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center">Оплата прошла!</h2>
      <p className="text-tg-hint text-center mb-1">
        Полный доступ активирован на 30 дней.
      </p>
      <p className="text-tg-hint text-center text-sm mb-8">
        Все 25 заданий ОГЭ теперь доступны.
      </p>

      <button
        onClick={onContinue}
        className="w-full max-w-xs py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-70"
      >
        Начать подготовку
      </button>
    </div>
  )
}

function FailedScreen({ message, onRetry, onBack }: { message: string; onRetry: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
      <div
        className="text-6xl mb-6"
        style={{ animation: 'bounce-in 0.5s ease-out' }}
      >
        😔
      </div>
      <h2 className="text-xl font-bold mb-2 text-center">{message}</h2>
      <p className="text-tg-hint text-center text-sm mb-8">
        Звёзды не были списаны.
      </p>

      <button
        onClick={onRetry}
        className="w-full max-w-xs py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-70 mb-3"
      >
        Попробовать ещё раз
      </button>
      <button
        onClick={onBack}
        className="w-full max-w-xs py-3 rounded-xl text-tg-hint font-semibold text-sm min-h-[44px] active:opacity-70"
      >
        ← На главную
      </button>
    </div>
  )
}

export default function Paywall() {
  const navigate = useNavigate()
  const { refreshPlan } = useAuth()
  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleBuy() {
    setPaymentState('creating')
    try {
      const { invoiceLink } = await createInvoiceLink()
      const tg = getTelegram()
      if (!tg) {
        setErrorMsg('Откройте приложение через Telegram')
        setPaymentState('failed')
        return
      }

      setPaymentState('pending')

      tg.openInvoice(invoiceLink, async (status) => {
        if (status === 'paid') {
          setPaymentState('success')
          await refreshPlan()
        } else if (status === 'cancelled') {
          setPaymentState('cancelled')
        } else {
          setErrorMsg('Оплата не прошла')
          setPaymentState('failed')
        }
      })
    } catch (err: any) {
      setErrorMsg(err.message || 'Ошибка при создании платежа')
      setPaymentState('failed')
    }
  }

  function resetToIdle() {
    setPaymentState('idle')
    setErrorMsg('')
  }

  // ── State-based screens ──

  if (paymentState === 'pending' || paymentState === 'creating') {
    return <PendingScreen />
  }

  if (paymentState === 'success') {
    return <SuccessScreen onContinue={() => navigate('/')} />
  }

  if (paymentState === 'cancelled') {
    return (
      <FailedScreen
        message="Оплата отменена"
        onRetry={resetToIdle}
        onBack={() => navigate('/')}
      />
    )
  }

  if (paymentState === 'failed') {
    return (
      <FailedScreen
        message={errorMsg || 'Ошибка оплаты'}
        onRetry={resetToIdle}
        onBack={() => navigate('/')}
      />
    )
  }

  // ── Default: idle ──

  return (
    <div className="p-4 animate-fade-in flex flex-col items-center justify-center min-h-screen">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold mb-2 text-center">Платный раздел</h2>
      <p className="text-tg-hint text-center mb-2">
        Задания №6–25 доступны по подписке.
      </p>
      <p className="text-tg-hint text-center mb-6 text-sm">
        Бесплатно: задания №1–5 с полной теорией, практикой и тестами.
      </p>

      <div className="w-full bg-tg-secondary-bg rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold">Полный доступ</span>
          <span className="text-lg font-bold">⭐ 1 000 Stars</span>
        </div>
        <ul className="text-sm text-tg-hint space-y-1.5">
          <li>✓ Все 25 заданий ОГЭ</li>
          <li>✓ Теория с пояснениями учителя</li>
          <li>✓ Бесконечная генерация задач</li>
          <li>✓ Итоговые тесты по каждой теме</li>
          <li>✓ Синхронизация прогресса</li>
          <li>✓ Доступ на 30 дней</li>
        </ul>
      </div>

      <button
        onClick={handleBuy}
        className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-70"
      >
        ⭐ Оплатить 1 000 Stars
      </button>

      <button
        onClick={() => navigate('/')}
        className="w-full py-3 rounded-xl text-tg-hint font-semibold text-sm min-h-[44px] active:opacity-70 mt-2"
      >
        ← На главную
      </button>
    </div>
  )
}
