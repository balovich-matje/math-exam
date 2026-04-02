import { useNavigate } from 'react-router-dom'
import { getUserName } from '../lib/telegram'
import { getCompletionStatus, getProgress } from '../lib/storage'

export default function Home() {
  const navigate = useNavigate()
  const name = getUserName()
  const status = getCompletionStatus()
  const progress = getProgress()

  const statusLabel = {
    not_started: 'Не начато',
    in_progress: 'В процессе',
    completed: `Результат: ${progress.test.score}/5`,
  }[status]

  const statusColor = {
    not_started: 'text-tg-hint',
    in_progress: 'text-yellow-500',
    completed: 'text-green-500',
  }[status]

  return (
    <div className="p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">Привет, {name}!</h1>
      <p className="text-tg-hint mb-6">Подготовка к ОГЭ по математике</p>

      <button
        onClick={() => navigate('/topic/6/theory')}
        className="w-full bg-tg-secondary-bg rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-tg-hint mb-1">Задание №6</p>
            <h2 className="text-lg font-semibold">Дроби и степени</h2>
          </div>
          <span className="text-2xl">📐</span>
        </div>
        <p className={`text-sm mt-2 font-medium ${statusColor}`}>
          {statusLabel}
        </p>
      </button>
    </div>
  )
}
