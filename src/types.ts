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

export interface TopicProgress {
  theory: boolean
  practice: { answers: Record<number, number>; score: number; completed: boolean }
  test: { answers: Record<number, number>; score: number; completedAt: string | null }
}
