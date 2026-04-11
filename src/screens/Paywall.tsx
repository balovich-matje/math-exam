import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createInvoiceLink } from '../lib/api'
import { getTelegram } from '../lib/telegram'

export default function Paywall() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleBuy() {
    setLoading(true)
    setError(null)
    try {
      const { invoiceLink } = await createInvoiceLink()
      const tg = getTelegram()
      if (!tg) {
        setError('Откройте приложение через Telegram')
        return
      }
      tg.openInvoice(invoiceLink, (status) => {
        if (status === 'paid') {
          window.location.reload()
        } else if (status === 'failed') {
          setError('Оплата не прошла. Попробуйте ещё раз.')
        }
      })
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании платежа')
    } finally {
      setLoading(false)
    }
  }

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
          <span className="text-lg font-bold">⭐ 10 Stars</span>
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
        disabled={loading}
        className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-70 disabled:opacity-50"
      >
        {loading ? 'Создаём платёж...' : '⭐ Оплатить 10 Stars'}
      </button>

      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

      <button
        onClick={() => navigate('/')}
        className="w-full py-3 rounded-xl text-tg-hint font-semibold text-sm min-h-[44px] active:opacity-70 mt-2"
      >
        ← На главную
      </button>
    </div>
  )
}
