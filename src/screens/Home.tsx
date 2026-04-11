import { useNavigate } from 'react-router-dom'
import { getUserName } from '../lib/telegram'
import { getCompletionStatus, getProgress } from '../lib/storage'
import { blockTopicStatus, getBlockProgress } from '../lib/blockStorage'
import { allTopics, isBlockTopic } from '../data/topics'
import { useAuth, isTopicFree } from '../lib/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const name = getUserName()
  const { plan } = useAuth()

  return (
    <div className="p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">Привет, {name}!</h1>
      <p className="text-tg-hint mb-4">Подготовка к ОГЭ по математике</p>

      <div className="space-y-3">
        {allTopics.map((topic, idx) => {
          const isFree = isTopicFree(topic.number)
          const locked = !isFree && plan === 'free'

          // Show separator before first paid topic
          const prevTopic = idx > 0 ? allTopics[idx - 1] : null
          const showPaywallDivider = !isFree && (!prevTopic || isTopicFree(prevTopic.number))
          let status: 'not_started' | 'in_progress' | 'completed'
          let statusLabel: string

          if (isBlockTopic(topic)) {
            status = blockTopicStatus(topic.id)
            const bp = getBlockProgress(topic.id)
            statusLabel = status === 'completed'
              ? `Тест пройден: ${bp.test.score}/${topic.blocks.length * 3}`
              : status === 'in_progress' ? 'В процессе' : 'Не начато'
          } else {
            status = getCompletionStatus(topic.id)
            const progress = getProgress(topic.id)
            statusLabel = status === 'completed'
              ? `Результат: ${progress.test.score}/${topic.test.length}`
              : status === 'in_progress' ? 'В процессе' : 'Не начато'
          }

          const statusColor = {
            not_started: 'text-tg-hint',
            in_progress: 'text-yellow-500',
            completed: 'text-green-500',
          }[status]

          return (
            <div key={topic.id}>
              {showPaywallDivider && (
                <div className="flex items-center gap-3 py-2 mb-1">
                  <div className="flex-1 h-px bg-tg-hint/20" />
                  <span className="text-xs text-tg-hint font-medium">
                    {plan === 'free' ? '🔒 Платный раздел' : '✓ Полный доступ'}
                  </span>
                  <div className="flex-1 h-px bg-tg-hint/20" />
                </div>
              )}
              <button
                onClick={() => navigate(locked ? '/paywall' : `/topic/${topic.id}/theory`)}
                className={`w-full bg-tg-secondary-bg rounded-2xl p-4 text-left active:scale-[0.98] transition-transform ${locked ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-tg-hint mb-0.5">
                      Задание №{topic.number}
                      {'wip' in topic && topic.wip && <span className="ml-2 text-xs text-orange-500 font-medium">WIP</span>}
                    </p>
                    <h2 className="text-base font-semibold truncate">{topic.title}</h2>
                  </div>
                  {locked && <span className="text-lg ml-2 shrink-0">🔒</span>}
                  {!locked && status === 'completed' && <span className="text-lg ml-2 shrink-0">✅</span>}
                  {!locked && status === 'in_progress' && <span className="text-lg ml-2 shrink-0">📝</span>}
                </div>
                <p className={`text-sm mt-1.5 font-medium ${locked ? 'text-tg-hint' : statusColor}`}>
                  {locked ? 'Доступно по подписке' : statusLabel}
                </p>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
