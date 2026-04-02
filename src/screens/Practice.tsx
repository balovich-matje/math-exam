import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { practiceProblems } from '../data/problems'
import { parseAnswer, isCorrect } from '../lib/check'
import { getProgress, saveProgress } from '../lib/storage'
import { getTelegram } from '../lib/telegram'
import Math from '../components/Math'
import ProgressBar from '../components/ProgressBar'

export default function Practice() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const allDone = results.length === practiceProblems.length

  useEffect(() => {
    const tg = getTelegram()
    if (!tg) return

    tg.BackButton.show()
    const onBack = () => navigate('/topic/6/theory')
    tg.BackButton.onClick(onBack)

    return () => {
      tg.BackButton.hide()
      tg.BackButton.offClick(onBack)
    }
  }, [navigate])

  useEffect(() => {
    const tg = getTelegram()
    if (!tg) return

    if (allDone) {
      tg.MainButton.setText('Перейти к тесту')
      tg.MainButton.show()
      const onMain = () => {
        const p = getProgress()
        const score = results.filter(Boolean).length
        p.practice = { answers: {}, score, completed: true }
        saveProgress(p)
        navigate('/topic/6/test')
      }
      tg.MainButton.onClick(onMain)
      return () => {
        tg.MainButton.hide()
        tg.MainButton.offClick(onMain)
      }
    } else {
      tg.MainButton.hide()
    }
  }, [allDone, results, navigate])

  const problem = practiceProblems[current]

  const handleCheck = () => {
    const parsed = parseAnswer(input)
    if (parsed === null) return
    const ok = isCorrect(parsed, problem.answer)
    setCorrect(ok)
    setChecked(true)
  }

  const handleNext = () => {
    setResults([...results, correct])
    setChecked(false)
    setCorrect(false)
    setInput('')
    if (current < practiceProblems.length - 1) {
      setCurrent(current + 1)
    }
  }

  const handleGoToTest = () => {
    const p = getProgress()
    const score = results.filter(Boolean).length
    p.practice = { answers: {}, score, completed: true }
    saveProgress(p)
    navigate('/topic/6/test')
  }

  return (
    <div className="pb-24 animate-fade-in">
      <ProgressBar current={2} />

      <div className="px-4">
        <h1 className="text-xl font-bold mb-4">Практика</h1>

        {!allDone ? (
          <div key={current} className="animate-slide-in">
            <p className="text-sm text-tg-hint mb-2">
              Задача {current + 1} из {practiceProblems.length}
            </p>

            <div className="bg-tg-secondary-bg rounded-xl p-4 mb-4">
              <p className="text-sm mb-2">{problem.text}</p>
              <div className="overflow-x-auto">
                <Math tex={problem.latex} display />
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                inputMode="decimal"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !checked) handleCheck()
                  if (e.key === 'Enter' && checked) handleNext()
                }}
                placeholder="Ваш ответ"
                disabled={checked}
                className="flex-1 px-4 py-3 rounded-xl bg-tg-secondary-bg text-tg-text text-base min-h-[44px] outline-none focus:ring-2 focus:ring-tg-button disabled:opacity-60"
              />
              {!checked ? (
                <button
                  onClick={handleCheck}
                  disabled={!input.trim()}
                  className="px-5 py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold min-h-[44px] disabled:opacity-40 active:opacity-80 transition-opacity"
                >
                  Проверить
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold min-h-[44px] active:opacity-80 transition-opacity"
                >
                  Далее
                </button>
              )}
            </div>

            {checked && (
              <div
                className={`p-3 rounded-xl text-sm animate-fade-in ${
                  correct
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {correct ? (
                  <span>✅ Верно!</span>
                ) : (
                  <span>❌ Неверно. Правильный ответ: {problem.answer}</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-lg font-semibold mb-1">
              Практика завершена!
            </p>
            <p className="text-tg-hint mb-6">
              Правильных ответов: {results.filter(Boolean).length} из{' '}
              {practiceProblems.length}
            </p>
            <button
              onClick={handleGoToTest}
              className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-80 transition-opacity"
            >
              Перейти к тесту
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
