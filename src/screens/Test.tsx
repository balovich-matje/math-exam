import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTopicById } from '../data/topics'
import { TopicData } from '../types'
import { parseAnswer, isCorrect } from '../lib/check'
import { getProgress, saveProgress } from '../lib/storage'
import { getTelegram } from '../lib/telegram'
import Math from '../components/Math'
import ProgressBar from '../components/ProgressBar'

export default function Test() {
  const navigate = useNavigate()
  const { topicId } = useParams<{ topicId: string }>()
  const topic = getTopicById(topicId!) as TopicData | undefined
  const problems = topic?.test ?? []

  const [current, setCurrent] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const allDone = results.length === problems.length

  useEffect(() => {
    const tg = getTelegram()
    if (!tg) return

    tg.BackButton.show()
    const onBack = () => navigate(`/topic/${topicId}/practice`)
    tg.BackButton.onClick(onBack)

    return () => {
      tg.BackButton.hide()
      tg.BackButton.offClick(onBack)
    }
  }, [navigate, topicId])

  useEffect(() => {
    const tg = getTelegram()
    if (!tg) return

    if (allDone) {
      tg.MainButton.setText('Завершить')
      tg.MainButton.show()
      const onMain = () => {
        const score = results.filter(Boolean).length
        const p = getProgress(topicId!)
        p.test = { answers: {}, score, completedAt: new Date().toISOString() }
        saveProgress(topicId!, p)
        navigate('/')
      }
      tg.MainButton.onClick(onMain)
      return () => {
        tg.MainButton.hide()
        tg.MainButton.offClick(onMain)
      }
    } else {
      tg.MainButton.hide()
    }
  }, [allDone, results, navigate, topicId])

  if (!topic) return <div className="p-4">Тема не найдена</div>

  const problem = problems[current]

  const handleCheck = () => {
    const parsed = parseAnswer(input)
    if (parsed === null) return
    const ok = isCorrect(parsed, problem.answer)
    setCorrect(ok)
    setChecked(true)
  }

  const handleNext = () => {
    const newResults = [...results, correct]
    setResults(newResults)
    setChecked(false)
    setCorrect(false)
    setInput('')
    if (current < problems.length - 1) {
      setCurrent(current + 1)
    }
  }

  const handleFinish = () => {
    const score = results.filter(Boolean).length
    const p = getProgress(topicId!)
    p.test = { answers: {}, score, completedAt: new Date().toISOString() }
    saveProgress(topicId!, p)
    navigate('/')
  }

  return (
    <div className="pb-24 animate-fade-in">
      <ProgressBar current={3} />

      <div className="px-4">
        <h1 className="text-xl font-bold mb-4">Тест</h1>

        {!allDone ? (
          <div key={current} className="animate-slide-in">
            <p className="text-sm text-tg-hint mb-2">
              Задача {current + 1} из {problems.length}
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
            <p className="text-5xl mb-4">
              {results.filter(Boolean).length >= 4 ? '🏆' : results.filter(Boolean).length >= 2 ? '👍' : '💪'}
            </p>
            <p className="text-2xl font-bold mb-2">
              {results.filter(Boolean).length} из {problems.length}
            </p>
            <p className="text-tg-hint mb-6">
              {results.filter(Boolean).length === problems.length
                ? 'Отлично! Все ответы верные!'
                : results.filter(Boolean).length >= 3
                  ? 'Хороший результат! Продолжай в том же духе.'
                  : 'Стоит повторить теорию и попробовать ещё раз.'}
            </p>

            <div className="space-y-2 mb-6">
              {problems.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                    results[i] ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  <span>{results[i] ? '✅' : '❌'}</span>
                  <div className="overflow-x-auto flex-1">
                    <Math tex={p.latex} />
                  </div>
                  {!results[i] && (
                    <span className="shrink-0 font-medium">= {p.answer}</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-80 transition-opacity"
            >
              Завершить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
