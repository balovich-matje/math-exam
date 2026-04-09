import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTopicById, isBlockTopic } from '../data/topics'
import { getBlockProgress, saveBlockProgress } from '../lib/blockStorage'
import { getTelegram } from '../lib/telegram'
import Math from '../components/Math'

export default function BlockTheory() {
  const navigate = useNavigate()
  const { topicId } = useParams<{ topicId: string }>()
  const topic = getTopicById(topicId!)
  const [blockIdx, setBlockIdx] = useState(0)

  if (!topic || !isBlockTopic(topic)) return <div className="p-4">Тема не найдена</div>

  const block = topic.blocks[blockIdx]
  const isLast = blockIdx === topic.blocks.length - 1

  const goNext = () => {
    if (isLast) {
      const p = getBlockProgress(topicId!)
      p.theoryDone = true
      saveBlockProgress(topicId!, p)
      navigate(`/topic/${topicId}/practice`)
    } else {
      setBlockIdx(i => i + 1)
    }
  }

  const goPrev = () => {
    if (blockIdx > 0) setBlockIdx(i => i - 1)
    else navigate('/')
  }

  useEffect(() => {
    const tg = getTelegram()
    if (!tg) return
    tg.BackButton.show()
    tg.BackButton.onClick(goPrev)
    tg.MainButton.hide()
    return () => {
      tg.BackButton.hide()
      tg.BackButton.offClick(goPrev)
    }
  }, [blockIdx])

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-tg-hint mb-1">Задание №{topic.number} · Теория</p>
        <h1 className="text-xl font-bold">{block.title}</h1>
        {/* Block dots */}
        <div className="flex gap-1.5 mt-3">
          {topic.blocks.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === blockIdx ? 'bg-tg-button flex-[2]' : i < blockIdx ? 'bg-tg-button/40 flex-1' : 'bg-tg-hint/30 flex-1'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-tg-hint mt-1.5">Блок {blockIdx + 1} из {topic.blocks.length}</p>
      </div>

      {/* Rules */}
      <div className="px-4 mt-3">
        <div className="space-y-2 mb-4">
          {block.rules.map((rule, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-tg-button font-bold shrink-0">{i + 1}.</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>

        {/* Examples */}
        <p className="text-xs font-semibold text-tg-hint uppercase tracking-wide mb-2">Примеры</p>
        <div className="space-y-3">
          {block.examples.map((ex, i) => (
            <div key={i} className="bg-tg-secondary-bg rounded-xl p-3">
              <div className="overflow-x-auto pb-1">
                <Math tex={ex.latex} display />
              </div>
              <p className="text-xs text-tg-hint mt-2">{ex.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="px-4 mt-6 flex gap-3">
        <button
          onClick={goPrev}
          className="flex-1 py-3 rounded-xl border border-tg-hint/30 text-tg-hint font-semibold text-sm min-h-[44px] active:opacity-70"
        >
          {blockIdx === 0 ? '← Назад' : '← Пред. блок'}
        </button>
        <button
          onClick={goNext}
          className="flex-[2] py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-sm min-h-[44px] active:opacity-80"
        >
          {isLast ? 'К практике →' : 'След. блок →'}
        </button>
      </div>
    </div>
  )
}
