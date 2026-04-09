import { useNavigate } from 'react-router-dom'

type Tab = 'theory' | 'practice' | 'test'

interface Props {
  topicId: string
  current: Tab
  locked?: boolean  // true = тест в процессе, навигация заблокирована
}

export default function TopicTabBar({ topicId, current, locked }: Props) {
  const navigate = useNavigate()

  const tabs: { key: Tab; label: string }[] = [
    { key: 'theory',   label: 'Теория'   },
    { key: 'practice', label: 'Практика' },
    { key: 'test',     label: 'Тест'     },
  ]

  const handleTab = (key: Tab) => {
    if (key === current) return
    if (locked) return
    navigate(`/topic/${topicId}/${key}`)
  }

  return (
    <div className="flex border-b border-tg-hint/20 bg-tg-bg sticky top-0 z-10">
      {tabs.map(tab => {
        const isActive   = tab.key === current
        const isDisabled = locked && tab.key !== current
        return (
          <button
            key={tab.key}
            onClick={() => handleTab(tab.key)}
            disabled={isDisabled}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative ${
              isActive
                ? 'text-tg-button'
                : isDisabled
                ? 'text-tg-hint/30 cursor-not-allowed'
                : 'text-tg-hint active:opacity-70'
            }`}
          >
            {tab.label}
            {isDisabled && <span className="ml-0.5">🔒</span>}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tg-button rounded-t-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}
