import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { theorySections } from '../data/theory'
import { getProgress, saveProgress } from '../lib/storage'
import { getTelegram } from '../lib/telegram'
import Math from '../components/Math'
import ProgressBar from '../components/ProgressBar'

export default function Theory() {
  const navigate = useNavigate()

  useEffect(() => {
    const tg = getTelegram()
    if (!tg) return

    tg.BackButton.show()
    const onBack = () => navigate('/')
    tg.BackButton.onClick(onBack)

    tg.MainButton.setText('Я готов к тесту')
    tg.MainButton.show()
    const onMain = () => {
      const p = getProgress()
      p.theory = true
      saveProgress(p)
      navigate('/topic/6/practice')
    }
    tg.MainButton.onClick(onMain)

    return () => {
      tg.BackButton.hide()
      tg.BackButton.offClick(onBack)
      tg.MainButton.hide()
      tg.MainButton.offClick(onMain)
    }
  }, [navigate])

  const handleReady = () => {
    const p = getProgress()
    p.theory = true
    saveProgress(p)
    navigate('/topic/6/practice')
  }

  return (
    <div className="pb-24 animate-fade-in">
      <ProgressBar current={1} />

      <div className="px-4">
        <h1 className="text-xl font-bold mb-4">Дроби и степени</h1>

        {theorySections.map((section) => (
          <div key={section.title} className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-tg-link">{section.title}</h2>

            <div className="space-y-2 mb-3">
              {section.rules.map((rule, i) => {
                const hasLatex = rule.includes('\\')
                return (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-tg-hint shrink-0">•</span>
                    {hasLatex ? (
                      <span><Math tex={rule} /></span>
                    ) : (
                      <span>{rule}</span>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="space-y-3">
              {section.examples.map((ex, i) => (
                <div key={i} className="bg-tg-secondary-bg rounded-xl p-3">
                  <div className="overflow-x-auto pb-1">
                    <Math tex={ex.latex} display />
                  </div>
                  <p className="text-xs text-tg-hint mt-2">{ex.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4">
        <button
          onClick={handleReady}
          className="w-full py-3 rounded-xl bg-tg-button text-tg-button-text font-semibold text-base min-h-[44px] active:opacity-80 transition-opacity"
        >
          Я готов к тесту
        </button>
      </div>
    </div>
  )
}
