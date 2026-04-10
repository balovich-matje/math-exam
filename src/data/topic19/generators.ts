import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

// Block 1 — Смежные углы: сумма = 180°
export function genBlock1(): GeneratedProblem {
  let a: number
  do { a = rnd(30, 150, 5) } while (a === 90)
  const b = 180 - a
  const hint = `\\text{Смежные углы: } ${a}° + x = 180° \\Rightarrow x = ${b}°`
  return {
    latex: `\\text{Угол } ${a}°,\\; \\text{смежный угол} = ?`,
    answer: b,
    hint,
  }
}

// Block 2 — Вертикальные углы (равны)
export function genBlock2(): GeneratedProblem {
  const a = rnd(40, 140, 5)
  const hint = `\\text{Вертикальные углы равны: } x = ${a}°`
  return {
    latex: `\\text{Вертикальный угол к } ${a}° = ?`,
    answer: a,
    hint,
  }
}

// Block 3 — Накрест лежащие углы при параллельных прямых (равны)
export function genBlock3(): GeneratedProblem {
  const a = rnd(35, 145, 5)
  const hint = `\\text{Накрест лежащие углы при параллельных прямых равны: } x = ${a}°`
  return {
    latex: `\\text{Накрест лежащий угол к } ${a}° \\text{ при парал. прямых} = ?`,
    answer: a,
    hint,
  }
}

// Block 4 — Односторонние углы при параллельных прямых: сумма = 180°
export function genBlock4(): GeneratedProblem {
  const a = rnd(40, 140, 5)
  const b = 180 - a
  const hint = `\\text{Односторонние углы при параллельных прямых: } ${a}° + x = 180° \\Rightarrow x = ${b}°`
  return {
    latex: `\\text{Односторонний угол к } ${a}° \\text{ при парал. прямых} = ?`,
    answer: b,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4]
