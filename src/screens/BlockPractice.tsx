import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTopicById, isBlockTopic } from '../data/topics'
import { getBlockProgress, saveBlockProgress } from '../lib/blockStorage'
import { getTelegram } from '../lib/telegram'
import { GeneratedProblem } from '../types'
import Math from '../components/Math'
import TopicTabBar from '../components/TopicTabBar'

const PROBLEMS_PER_BLOCK = 2
const TOLERANCE = 0.001

function parseAnswer(s: string): number {
  return parseFloat(s.replace(',', '.').trim())
}

export default function BlockPractice() {
  const navigate = useNavigate()
  const { topicId } = useParams<{ topicId: string }>()
  const topic = getTopicById(topicId!)

  if (!topic || !isBlockTopic(topic)) return <div className="p-4">Тема не найдена</div>

  const totalBlocks = topic.blocks.length

  const [blockIdx, setBlockIdx]         = useState(0)
  const [correctCount, setCorrectCount] = useState(0)   // 0 or 1 (need 2 to pass)
  const [problem, setProblem]           = useState<GeneratedProblem>(() => topic.generators[0]())
  const [input, setInput]               = useState('')
  const [feedback, setFeedback]         = useState<null | 'correct' | 'incorrect'>(null)
  const [done, setDone]                 = useState(false)

  const nextProblem = useCallback((newBlockIdx: number, newCorrectCount: number) => {
    setProblem(topic.generators[newBlockIdx]())
    setInput('')
    setFeedback(null)
    setBlockIdx(newBlockIdx)
    setCorrectCount(newCorrectCount)
  }, [topic])

  const handleSubmit = () => {
    if (feedback !== null) return
    const userVal = parseAnswer(input)
    const correct = !isNaN(userVal) && globalThis.Math.abs(userVal - problem.answer) < TOLERANCE

    if (correct) {
      setFeedback('correct')
      const newCorrect = correctCount + 1
      if (newCorrect >= PROBLEMS_PER_BLOCK) {
        // Block complete
        const p = getBlockProgress(topicId!)
        const block = topic.blocks[blockIdx]
        if (!p.practice.completedBlocks.includes(block.id)) {
          p.practice.completedBlocks.push(block.id)
        }
        if (blockIdx + 1 >= totalBlocks) {
          p.practice.allDone = true
          saveBlockProgress(topicId!, p)
          setTimeout(() => setDone(true), 800)
        } else {
          saveBlockProgress(topicId!, p)
          setTimeout(() => nextProblem(blockIdx + 1, 0), 800)
        }
      } else {
        setTimeout(() => nextProblem(blockIdx, newCorrect), 800)
      }
    } else {
      setFeedback('incorrect')
    }
  }

  const handleRetry = () => {
    setProblem(topic.generators[blockIdx]())
    setInput('')
    setFeedback(null)
  }

  useEffect(() => {
    const tg = getTelegram()
    if (!tg) return
    tg.BackButton.show()
    const onBack = () => navigate(`/topic/${topicId}/theory`)
    tg.BackButton.onClick(onBack)
    tg.MainButton.hide()
    return () => {
      tg.BackButton.hide()
      tg.BackButton.offClick(onBack)
    }
  }, [navigate, topicId])

  if (done) {
    return (
      <>
        <TopicTabBar topicId={topicId!} current="practice" />
        <div className="p-4 flex flex-col items-center justify-center animate-fade-in">
          <div className="text-5xl mb-4 mt-8">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Практика завершена!</h2>
          <p className="text-tg-hint text-center mb-8">Все 7 блоков пройдены. Можно переходить к итоговому тесту.</p>
          <button
            onClick={() => navigate(`/topic/${topicId}/test`)}
            className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-80"
          >
            Перейти к тесту →
          </button>
        </div>
      </>
    )
  }

  const block = topic.blocks[blockIdx]

  return (
    <>
    <TopicTabBar topicId={topicId!} current="practice" />
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-tg-hint mb-1">Задание №{topic.number} · Практика</p>
        <h2 className="text-base font-semibold">{block.title}</h2>
        {/* Progress dots */}
        <div className="flex gap-1.5 mt-2">
          {topic.blocks.map((b, i) => {
            const p = getBlockProgress(topicId!)
            const done = p.practice.completedBlocks.includes(b.id)
            return (
              <div
                key={i}
                className={`h-1.5 rounded-full flex-1 ${
                  done ? 'bg-green-500' : i === blockIdx ? 'bg-tg-button' : 'bg-tg-hint/30'
                }`}
              />
            )
          })}
        </div>
        <p className="text-xs text-tg-hint mt-1">
          Блок {blockIdx + 1} из {totalBlocks} · Задача {correctCount + 1} из {PROBLEMS_PER_BLOCK}
        </p>
      </div>

      {/* Problem */}
      <div className="px-4 mt-4">
        <div className="bg-tg-secondary-bg rounded-2xl p-4 mb-4">
          <p className="text-xs text-tg-hint mb-2">Вычисли:</p>
          <div className="overflow-x-auto text-center">
            <Math tex={problem.latex + ' = \\, ?'} display />
          </div>
        </div>

        {/* Feedback */}
        {feedback === 'correct' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-4">
            <p className="text-green-500 font-semibold text-sm">✓ Правильно! Ответ: {problem.answer}</p>
          </div>
        )}
        {feedback === 'incorrect' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
            <p className="text-red-500 font-semibold text-sm mb-1">✗ Неверно. Ответ был: {problem.answer}</p>
            <div className="text-xs text-tg-hint overflow-x-auto">
              <Math tex={problem.hint} />
            </div>
          </div>
        )}

        {/* Input */}
        {feedback === null && (
          <>
            <input
              type="text"
              inputMode="decimal"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Введи ответ (например: 1,25)"
              className="w-full bg-tg-secondary-bg rounded-xl px-4 py-3 text-tg-text text-base outline-none focus:ring-2 focus:ring-tg-button mb-3"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-80 disabled:opacity-40"
            >
              Проверить
            </button>
          </>
        )}

        {feedback === 'incorrect' && (
          <button
            onClick={handleRetry}
            className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-80 mt-2"
          >
            Новый пример →
          </button>
        )}
      </div>
    </div>
    </>
  )
}
