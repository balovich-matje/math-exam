import { BlockTopicProgress } from '../types'
import { getToken, saveProgress as apiSaveProgress } from './api'

const KEY = 'oge_block_progress'

function getAll(): Record<string, BlockTopicProgress> {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveAll(data: Record<string, BlockTopicProgress>) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function defaultBlockProgress(): BlockTopicProgress {
  return {
    theoryDone: false,
    practice: { completedBlocks: [], allDone: false },
    test: { completedAt: null, score: 0, blockScores: {}, passed: false },
  }
}

export function getBlockProgress(topicId: string): BlockTopicProgress {
  return getAll()[topicId] ?? defaultBlockProgress()
}

export function saveBlockProgress(topicId: string, p: BlockTopicProgress) {
  const all = getAll()
  all[topicId] = p
  saveAll(all)

  // Background sync to server (fire and forget)
  if (getToken()) {
    apiSaveProgress(topicId, p).catch(() => {})
  }
}

export function blockTopicStatus(topicId: string): 'not_started' | 'in_progress' | 'completed' {
  const p = getBlockProgress(topicId)
  if (p.test.passed) return 'completed'
  if (p.theoryDone || p.practice.completedBlocks.length > 0) return 'in_progress'
  return 'not_started'
}
