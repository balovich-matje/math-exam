import { GeneratedProblem } from '../../types'

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Block 1 — Классическая вероятность
export function genBlock1(): GeneratedProblem {
  const total = pick([8, 10, 12, 15, 20])
  const maxFav = Math.floor(total / 2)
  const favorable = Math.floor(Math.random() * maxFav) + 1
  const answer = Math.round((favorable / total) * 100) / 100
  const hint = `P = \\dfrac{${favorable}}{${total}} = ${answer}`
  return {
    latex: `\\text{В мешке } ${total} \\text{ шаров, из них } ${favorable} \\text{ красных. } P(\\text{красный}) = ?`,
    answer,
    hint,
  }
}

// Block 2 — Противоположное событие
export function genBlock2(): GeneratedProblem {
  const P_A = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8])
  const answer = Math.round((1 - P_A) * 100) / 100
  const hint = `P(\\bar{A}) = 1 - P(A) = 1 - ${P_A} = ${answer}`
  return {
    latex: `P(A) = ${P_A}, \\quad P(\\bar{A}) = ?`,
    answer,
    hint,
  }
}

// Block 3 — Частота успеха
export function genBlock3(): GeneratedProblem {
  const total = pick([10, 15, 20, 25, 30])
  // pick n_favorable as a nice fraction of total
  const fractions = [2, 4, 5].filter(d => total % d === 0).map(d => total / d)
  if (fractions.length === 0) fractions.push(Math.floor(total / 2))
  const n_favorable = pick(fractions)
  const answer = Math.round((n_favorable / total) * 100) / 100
  const hint = `\\text{Частота} = \\dfrac{${n_favorable}}{${total}} = ${answer}`
  return {
    latex: `\\text{Из } ${total} \\text{ попыток успех } ${n_favorable} \\text{ раз. Найди частоту успеха.}`,
    answer,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3]
