import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTopicById, isBlockTopic } from '../data/topics'
import { getBlockProgress, saveBlockProgress } from '../lib/blockStorage'
import { getTelegram } from '../lib/telegram'
import { GeneratedProblem } from '../types'
import Math from '../components/Math'

const QUESTIONS_PER_BLOCK = 3
const TOLERANCE = 0.001

function parseAnswer(s: string): number {
  return parseFloat(s.replace(',', '.').trim())
}

interface TestQuestion {
  blockIdx: number
  blockId: string
  blockTitle: string
  problem: GeneratedProblem
}

import { BlockTopicData } from '../types'

function buildTest(topic: BlockTopicData): TestQuestion[] {
  const questions: TestQuestion[] = []
  for (let q = 0; q < QUESTIONS_PER_BLOCK; q++) {
    for (let b = 0; b < topic.blocks.length; b++) {
      questions.push({
        blockIdx: b,
        blockId: topic.blocks[b].id,
        blockTitle: topic.blocks[b].title,
        problem: topic.generators[b](),
      })
    }
  }
  return questions
}

export default function BlockTest() {
  const navigate = useNavigate()
  const { topicId } = useParams<{ topicId: string }>()
  const topic = getTopicById(topicId!)

  if (!topic || !isBlockTopic(topic)) return <div className="p-4">Тема не найдена</div>

  const [questions] = useState<TestQuestion[]>(() => buildTest(topic))
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [input, setInput] = useState('')
  const [showResult, setShowResult] = useState(false)

  const q = questions[current]
  const total = questions.length

  const handleNext = () => {
    const val = input.trim() ? parseAnswer(input) : NaN
    const newAnswers = [...answers]
    newAnswers[current] = isNaN(val) ? null : val
    setAnswers(newAnswers)
    setInput('')

    if (current + 1 >= total) {
      // Compute results
      const blockScores: Record<string, number> = {}
      let score = 0
      questions.forEach((q, i) => {
        const a = newAnswers[i]
        const correct = a !== null && globalThis.Math.abs(a - q.problem.answer) < TOLERANCE
        if (correct) score++
        blockScores[q.blockId] = (blockScores[q.blockId] ?? 0) + (correct ? 1 : 0)
      })
      const passed = score === total
      const p = getBlockProgress(topicId!)
      p.test = { completedAt: new Date().toISOString(), score, blockScores, passed }
      saveBlockProgress(topicId!, p)
      setShowResult(true)
    } else {
      setCurrent(c => c + 1)
    }
  }

  useEffect(() => {
    const tg = getTelegram()
    if (!tg) return
    tg.BackButton.show()
    const onBack = () => navigate(`/topic/${topicId}/practice`)
    tg.BackButton.onClick(onBack)
    tg.MainButton.hide()
    return () => {
      tg.BackButton.hide()
      tg.BackButton.offClick(onBack)
    }
  }, [navigate, topicId])

  // ── Results screen ──────────────────────────────────────────────────────

  if (showResult) {
    const p = getBlockProgress(topicId!)
    const { score, blockScores, passed } = p.test
    const weakBlocks = topic.blocks.filter(b => (blockScores[b.id] ?? 0) < QUESTIONS_PER_BLOCK)

    return (
      <div className="p-4 animate-fade-in pb-24">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{passed ? '🏆' : '📊'}</div>
          <h2 className="text-2xl font-bold mb-1">
            {passed ? 'Тест пройден!' : 'Тест завершён'}
          </h2>
          <p className="text-tg-hint">
            Результат: <span className="font-bold text-tg-text">{score}</span> из {total}
          </p>
        </div>

        {/* Per-block scores */}
        <div className="space-y-2 mb-6">
          {topic.blocks.map(b => {
            const correct = blockScores[b.id] ?? 0
            const full = correct === QUESTIONS_PER_BLOCK
            return (
              <div key={b.id} className="bg-tg-secondary-bg rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm flex-1 mr-2">{b.title}</span>
                <span className={`text-sm font-bold shrink-0 ${full ? 'text-green-500' : 'text-red-400'}`}>
                  {correct}/{QUESTIONS_PER_BLOCK} {full ? '✓' : '✗'}
                </span>
              </div>
            )
          })}
        </div>

        {/* Advice */}
        {weakBlocks.length > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
            <p className="text-orange-500 font-semibold text-sm mb-2">Повтори теорию по блокам:</p>
            <ul className="space-y-1">
              {weakBlocks.map(b => (
                <li key={b.id} className="text-sm text-tg-hint">• {b.title}</li>
              ))}
            </ul>
          </div>
        )}

        {passed ? (
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-80"
          >
            На главную
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/topic/${topicId}/theory`)}
              className="w-full py-3 rounded-xl border border-tg-hint/30 text-tg-hint font-semibold text-sm min-h-[44px] active:opacity-70"
            >
              Повторить теорию
            </button>
            <button
              onClick={() => { window.location.reload() }}
              className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-80"
            >
              Пройти тест заново
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Test screen ─────────────────────────────────────────────────────────

  const progress = ((current) / total) * 100

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-tg-hint">Задание №{topic.number} · Тест</p>
          <p className="text-xs font-bold text-tg-text">{current + 1} / {total}</p>
        </div>
        <div className="w-full h-1.5 bg-tg-hint/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-tg-button rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-tg-hint mt-1">{q.blockTitle}</p>
      </div>

      {/* Problem */}
      <div className="px-4 mt-4">
        <div className="bg-tg-secondary-bg rounded-2xl p-4 mb-4">
          <p className="text-xs text-tg-hint mb-2">Вычисли:</p>
          <div className="overflow-x-auto text-center">
            <Math tex={q.problem.latex + ' = \\, ?'} display />
          </div>
        </div>

        <input
          type="text"
          inputMode="decimal"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleNext()}
          placeholder="Введи ответ (например: 1,25)"
          className="w-full bg-tg-secondary-bg rounded-xl px-4 py-3 text-tg-text text-base outline-none focus:ring-2 focus:ring-tg-button mb-3"
        />

        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-80"
        >
          {current + 1 < total ? 'Далее →' : 'Завершить тест'}
        </button>

        {!input.trim() && (
          <p className="text-xs text-tg-hint text-center mt-2">Можно пропустить — ответ будет засчитан как неверный</p>
        )}
      </div>
    </div>
  )
}
