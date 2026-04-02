const steps = ['Теория', 'Практика', 'Тест']

interface ProgressBarProps {
  current: 1 | 2 | 3
}

export default function ProgressBar({ current }: ProgressBarProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div
              className={`h-1.5 rounded-full flex-1 transition-colors ${
                i < current ? 'bg-tg-button' : 'bg-tg-secondary-bg'
              }`}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-tg-hint text-center">
        Шаг {current} из 3 — {steps[current - 1]}
      </p>
    </div>
  )
}
