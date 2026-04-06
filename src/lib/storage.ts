import { TopicProgress } from '../types'

const STORAGE_KEY = 'oge_math_progress'

const defaultProgress: TopicProgress = {
  theory: false,
  practice: { answers: {}, score: 0, completed: false },
  test: { answers: {}, score: 0, completedAt: null },
}

function getAllProgress(): Record<string, TopicProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, TopicProgress>
  } catch {
    return {}
  }
}

function saveAllProgress(all: Record<string, TopicProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function getProgress(topicId: string): TopicProgress {
  const all = getAllProgress()
  return all[topicId] ?? { ...defaultProgress }
}

export function saveProgress(topicId: string, progress: TopicProgress) {
  const all = getAllProgress()
  all[topicId] = progress
  saveAllProgress(all)
}

export function getCompletionStatus(topicId: string): 'not_started' | 'in_progress' | 'completed' {
  const p = getProgress(topicId)
  if (p.test.completedAt) return 'completed'
  if (p.theory || p.practice.completed) return 'in_progress'
  return 'not_started'
}
