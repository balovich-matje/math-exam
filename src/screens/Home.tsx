import { useNavigate } from 'react-router-dom'
import { getUserName } from '../lib/telegram'
import { getCompletionStatus, getProgress } from '../lib/storage'
import { allTopics } from '../data/topics'

export default function Home() {
  const navigate = useNavigate()
  const name = getUserName()

  return (
    <div className="p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">Привет, {name}!</h1>
      <p className="text-tg-hint mb-4">Подготовка к ОГЭ по математике</p>

      <div className="space-y-3">
        {allTopics.map((topic) => {
          const status = getCompletionStatus(topic.id)
          const progress = getProgress(topic.id)

          const statusLabel = {
            not_started: 'Не начато',
            in_progress: 'В процессе',
            completed: `Результат: ${progress.test.score}/${topic.test.length}`,
          }[status]

          const statusColor = {
            not_started: 'text-tg-hint',
            in_progress: 'text-yellow-500',
            completed: 'text-green-500',
          }[status]

          return (
            <button
              key={topic.id}
              onClick={() => navigate(`/topic/${topic.id}/theory`)}
              className="w-full bg-tg-secondary-bg rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-tg-hint mb-0.5">
                    Задание №{topic.number}
                    {topic.wip && <span className="ml-2 text-xs text-orange-500 font-medium">WIP</span>}
                  </p>
                  <h2 className="text-base font-semibold truncate">{topic.title}</h2>
                </div>
                {status === 'completed' && <span className="text-lg ml-2 shrink-0">✅</span>}
                {status === 'in_progress' && <span className="text-lg ml-2 shrink-0">📝</span>}
              </div>
              <p className={`text-sm mt-1.5 font-medium ${statusColor}`}>
                {statusLabel}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
