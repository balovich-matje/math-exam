import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

// Block 1 — Третий угол треугольника: C = 180 - A - B
export function genBlock1(): GeneratedProblem {
  let A: number, B: number
  do {
    A = rnd(30, 80, 5)
    B = rnd(30, 80, 5)
  } while (A + B >= 180 || 180 - A - B < 10)
  const C = 180 - A - B
  const hint = `\\angle C = 180° - ${A}° - ${B}° = ${C}°`
  return {
    latex: `\\angle A = ${A}°,\\; \\angle B = ${B}°,\\; \\angle C = ?`,
    answer: C,
    hint,
  }
}

// Block 2 — Площадь треугольника: S = a·h/2
export function genBlock2(): GeneratedProblem {
  const a = rnd(4, 12)
  const h = rnd(3, 10)
  const S = a * h / 2
  const hint = `S = \\dfrac{${a} \\cdot ${h}}{2} = \\dfrac{${a*h}}{2} = ${S}`
  return {
    latex: `\\text{Основание } a = ${a},\\; h = ${h},\\; S = ?`,
    answer: S,
    hint,
  }
}

// Block 3 — Сумма углов n-угольника: (n-2)·180
export function genBlock3(): GeneratedProblem {
  const n = rnd(5, 9)
  const S = (n - 2) * 180
  const hint = `S = (${n} - 2) \\cdot 180° = ${n-2} \\cdot 180° = ${S}°`
  return {
    latex: `\\text{Сумма углов } ${n}\\text{-угольника}`,
    answer: S,
    hint,
  }
}

// Block 4 — Внешний угол треугольника = A + B (не смежная вершина)
export function genBlock4(): GeneratedProblem {
  const A = rnd(30, 70, 5)
  const B = rnd(30, 70, 5)
  const ext = A + B
  const C = 180 - ext
  if (C <= 0) return genBlock4()  // safety fallback
  const hint = `\\text{Внешний угол} = \\angle A + \\angle B = ${A}° + ${B}° = ${ext}°`
  return {
    latex: `\\angle A = ${A}°,\\; \\angle B = ${B}°,\\; \\text{внешний угол при вершине C} = ?`,
    answer: ext,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4]
