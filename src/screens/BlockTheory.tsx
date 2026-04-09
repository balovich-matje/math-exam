import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTopicById, isBlockTopic } from '../data/topics'
import { getBlockProgress, saveBlockProgress } from '../lib/blockStorage'
import { getTelegram } from '../lib/telegram'
import { InfoCard } from '../types'
import MathComponent from '../components/Math'

// ── Inline rule renderer ─────────────────────────────────────────────────
// Parses [→ Card Title] markers into tappable link buttons
function RuleText({
  text,
  onLink,
}: {
  text: string
  onLink: (title: string) => void
}) {
  const parts = text.split(/(\[→[^\]]+\])/)
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/\[→ (.+)\]/)
        if (m) {
          return (
            <button
              key={i}
              onClick={() => onLink(m[1])}
              className="text-tg-link text-xs font-semibold underline underline-offset-2 ml-1"
            >
              → {m[1]}
            </button>
          )
        }
        return part.includes('\\') ? (
          <MathComponent key={i} tex={part} />
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </>
  )
}

// ── Line renderer (for info card content) ───────────────────────────────
// Supports:
//   **bold text**  → rendered as <strong> (no KaTeX)
//   lines with actual math commands → rendered as KaTeX display
//   plain text → rendered as <p>
const MATH_COMMANDS = /\\(dfrac|frac|tfrac|times|div|cdot|Rightarrow|rightarrow|leq|geq|textcolor|underbrace|mathbf|phantom|hline|begin|end|sqrt|text\b)/

function InfoLine({ line }: { line: string }) {
  // LaTeX: contains real math operators
  if (MATH_COMMANDS.test(line)) {
    return (
      <div className="overflow-x-auto py-1">
        <MathComponent tex={line} display />
      </div>
    )
  }
  // Bold segments with **...**
  if (line.includes('**')) {
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    return (
      <p className="text-sm text-tg-text leading-snug">
        {parts.map((p, i) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={i}>{p.slice(2, -2)}</strong>
            : <span key={i}>{p}</span>
        )}
      </p>
    )
  }
  return <p className="text-sm text-tg-text leading-snug">{line}</p>
}

// ── Accordion info card ──────────────────────────────────────────────────
function InfoCardAccordion({
  card,
  isOpen,
  onToggle,
  cardRef,
}: {
  card: InfoCard
  isOpen: boolean
  onToggle: () => void
  cardRef?: React.RefObject<HTMLDivElement>
}) {
  return (
    <div
      ref={cardRef}
      className="border border-tg-hint/20 rounded-xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left active:opacity-70"
      >
        <span className="text-sm font-semibold text-tg-link">{card.title}</span>
        <span className="text-tg-hint text-sm ml-2 shrink-0">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-2 border-t border-tg-hint/10 pt-3">
          {card.lines.map((line, i) => (
            <InfoLine key={i} line={line} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main screen ──────────────────────────────────────────────────────────
export default function BlockTheory() {
  const navigate = useNavigate()
  const { topicId } = useParams<{ topicId: string }>()
  const topic = getTopicById(topicId!)

  const [blockIdx, setBlockIdx] = useState(0)
  const [openCards, setOpenCards] = useState<Set<string>>(new Set())
  const cardRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!topic || !isBlockTopic(topic)) return <div className="p-4">Тема не найдена</div>

  const block = topic.blocks[blockIdx]
  const isLast = blockIdx === topic.blocks.length - 1

  // Ensure refs exist for each info card
  if (block.infoCards) {
    block.infoCards.forEach(card => {
      if (!cardRefs.current[card.title]) {
        cardRefs.current[card.title] = { current: null } as React.RefObject<HTMLDivElement>
      }
    })
  }

  const toggleCard = (title: string) => {
    setOpenCards(prev => {
      const next = new Set(prev)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
        // Scroll to the card after it opens
        setTimeout(() => {
          cardRefs.current[title]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
      }
      return next
    })
  }

  const handleLinkClick = (title: string) => {
    // Open the card and scroll to it
    setOpenCards(prev => {
      const next = new Set(prev)
      next.add(title)
      return next
    })
    setTimeout(() => {
      cardRefs.current[title]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const goNext = () => {
    if (isLast) {
      const p = getBlockProgress(topicId!)
      p.theoryDone = true
      saveBlockProgress(topicId!, p)
      navigate(`/topic/${topicId}/practice`)
    } else {
      setBlockIdx(i => i + 1)
      setOpenCards(new Set())
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goPrev = () => {
    if (blockIdx > 0) {
      setBlockIdx(i => i - 1)
      setOpenCards(new Set())
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
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
    <div ref={scrollRef} className="pb-28 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-tg-hint mb-1">Задание №{topic.number} · Теория</p>
        <h1 className="text-xl font-bold">{block.title}</h1>
        {/* Progress dots */}
        <div className="flex gap-1.5 mt-3">
          {topic.blocks.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === blockIdx
                  ? 'bg-tg-button flex-[2]'
                  : i < blockIdx
                  ? 'bg-tg-button/40 flex-1'
                  : 'bg-tg-hint/30 flex-1'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-tg-hint mt-1.5">
          Блок {blockIdx + 1} из {topic.blocks.length}
        </p>
      </div>

      {/* Rules */}
      <div className="px-4 mt-3">
        <div className="space-y-2.5 mb-5">
          {block.rules.map((rule, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-tg-button font-bold shrink-0 mt-0.5">{i + 1}.</span>
              <span className="leading-snug">
                <RuleText text={rule} onLink={handleLinkClick} />
              </span>
            </div>
          ))}
        </div>

        {/* Examples */}
        <p className="text-xs font-semibold text-tg-hint uppercase tracking-wide mb-2">
          Примеры
        </p>
        <div className="space-y-3 mb-5">
          {block.examples.map((ex, i) => (
            <div key={i} className="bg-tg-secondary-bg rounded-xl p-3">
              <div className="overflow-x-auto pb-1">
                <MathComponent tex={ex.latex} display />
              </div>
              <p className="text-xs text-tg-hint mt-2">{ex.explanation}</p>
            </div>
          ))}
        </div>

        {/* Info cards (accordion) */}
        {block.infoCards && block.infoCards.length > 0 && (
          <>
            <p className="text-xs font-semibold text-tg-hint uppercase tracking-wide mb-2">
              Подробнее
            </p>
            <div className="space-y-2 mb-5">
              {block.infoCards.map(card => (
                <InfoCardAccordion
                  key={card.title}
                  card={card}
                  isOpen={openCards.has(card.title)}
                  onToggle={() => toggleCard(card.title)}
                  cardRef={cardRefs.current[card.title]}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="px-4 flex gap-3">
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
