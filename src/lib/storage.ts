import { TopicProgress } from '../types'

const STORAGE_KEY = 'oge_math_progress'

const defaultProgress: TopicProgress = {
  theory: false,
  practice: { answers: {}, score: 0, completed: false },
  test: { answers: {}, score: 0, completedAt: null },
}

export function getProgress(): TopicProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultProgress }
    return JSON.parse(raw) as TopicProgress
  } catch {
    return { ...defaultProgress }
  }
}

export function saveProgress(progress: TopicProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function getCompletionStatus(): 'not_started' | 'in_progress' | 'completed' {
  const p = getProgress()
  if (p.test.completedAt) return 'completed'
  if (p.theory || p.practice.completed) return 'in_progress'
  return 'not_started'
}
