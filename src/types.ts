export interface Problem {
  id: number
  text: string
  latex: string
  answer: number
}

export interface TheorySection {
  title: string
  rules: string[]
  examples: { latex: string; explanation: string }[]
}

export interface TopicData {
  id: string
  number: string
  title: string
  wip?: string
  theory: TheorySection[]
  practice: Problem[]
  test: Problem[]
}

// ── Block-based topic types (new format) ──────────────────────────────────

export interface GeneratedProblem {
  latex: string
  answer: number
  hint: string
}

export interface InfoCard {
  title: string
  lines: string[]  // plain text or LaTeX (detected by presence of '\\')
}

export interface TheoryBlock {
  id: string
  title: string
  rules: string[]  // may contain [→ Card Title] for clickable links to info cards
  examples: { latex: string; explanation: string }[]
  infoCards?: InfoCard[]
}

export interface BlockTopicData {
  id: string
  number: string
  title: string
  format: 'blocks'
  blocks: TheoryBlock[]
  generators: Array<() => GeneratedProblem>
}

export interface BlockTopicProgress {
  theoryDone: boolean
  practice: {
    completedBlocks: string[]  // block ids
    allDone: boolean
  }
  test: {
    completedAt: string | null
    score: number            // out of 21
    blockScores: Record<string, number>  // block id → correct out of 3
    passed: boolean
  }
}

// ── Legacy topic progress ──────────────────────────────────────────────────

export interface TopicProgress {
  theory: boolean
  practice: { answers: Record<number, number>; score: number; completed: boolean }
  test: { answers: Record<number, number>; score: number; completedAt: string | null }
}
