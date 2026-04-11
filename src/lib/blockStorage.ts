import { BlockTopicProgress } from '../types'
import { getToken, saveProgress as apiSaveProgress, fetchAllProgress } from './api'

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

/**
 * Download progress from server and merge into localStorage.
 * Server wins if it has more completed blocks or a passed test.
 */
export async function syncProgressFromServer(): Promise<void> {
  try {
    const { progress } = await fetchAllProgress()
    if (!progress || typeof progress !== 'object') return

    const local = getAll()
    let changed = false

    for (const [topicId, serverData] of Object.entries(progress)) {
      const server = serverData as BlockTopicProgress
      if (!server) continue

      const loc = local[topicId] ?? defaultBlockProgress()

      // Server wins if it has a passed test and local doesn't
      if (server.test?.passed && !loc.test?.passed) {
        local[topicId] = server
        changed = true
        continue
      }

      // Server wins if it has more completed practice blocks
      const serverBlocks = server.practice?.completedBlocks?.length ?? 0
      const localBlocks = loc.practice?.completedBlocks?.length ?? 0
      if (serverBlocks > localBlocks) {
        local[topicId] = server
        changed = true
        continue
      }

      // Local wins otherwise (offline progress)
    }

    if (changed) saveAll(local)
  } catch {
    // Server unavailable — use local only
  }
}

export function blockTopicStatus(topicId: string): 'not_started' | 'in_progress' | 'completed' {
  const p = getBlockProgress(topicId)
  if (p.test.passed) return 'completed'
  if (p.theoryDone || p.practice.completedBlocks.length > 0) return 'in_progress'
  return 'not_started'
}
