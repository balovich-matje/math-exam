interface Props {
  onComplete: () => void
}

export default function Onboarding({ onComplete }: Props) {
  return (
    <div className="p-6 animate-fade-in flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">📐</div>
        <h1 className="text-2xl font-bold mb-2 text-center">ОГЭ Математика 2026</h1>
        <p className="text-tg-hint text-center mb-8 text-sm leading-relaxed max-w-xs">
          Готовься к экзамену с адаптивными задачами,
          подробной теорией и итоговыми тестами.
        </p>

        <div className="w-full space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-xl">📖</span>
            <div>
              <p className="font-semibold text-sm">Теория по блокам</p>
              <p className="text-xs text-tg-hint">Правила, примеры и подсказки для каждой темы</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">🔄</span>
            <div>
              <p className="font-semibold text-sm">Бесконечная практика</p>
              <p className="text-xs text-tg-hint">Задачи генерируются — каждый раз новые</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">✅</span>
            <div>
              <p className="font-semibold text-sm">Итоговый тест</p>
              <p className="text-xs text-tg-hint">21 вопрос — проверь готовность к экзамену</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-80"
      >
        Начать подготовку
      </button>

      <p className="text-xs text-tg-hint text-center mt-3">
        Задания №1–5 — бесплатно
      </p>
    </div>
  )
}
