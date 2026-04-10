import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

// Block 1 — Площадь прямоугольника: S = a·b
export function genBlock1(): GeneratedProblem {
  const a = rnd(4, 15)
  const b = rnd(3, 12)
  const S = a * b
  const hint = `S = ${a} \\cdot ${b} = ${S}`
  return {
    latex: `a = ${a},\\; b = ${b},\\; S_{\\text{прямоугольника}} = ?`,
    answer: S,
    hint,
  }
}

// Block 2 — Площадь треугольника: S = base·height/2
export function genBlock2(): GeneratedProblem {
  const base = rnd(4, 14)
  const height = rnd(3, 10)
  const S = base * height / 2
  const hint = `S = \\dfrac{${base} \\cdot ${height}}{2} = \\dfrac{${base*height}}{2} = ${S}`
  return {
    latex: `\\text{осн.} = ${base},\\; h = ${height},\\; S_{\\text{треугольника}} = ?`,
    answer: S,
    hint,
  }
}

// Block 3 — Площадь трапеции: S = (a+b)·h/2
export function genBlock3(): GeneratedProblem {
  const a = rnd(4, 12)
  const b = rnd(2, a - 1)
  const h = rnd(3, 8)
  const S = (a + b) * h / 2
  const hint = `S = \\dfrac{(${a} + ${b}) \\cdot ${h}}{2} = \\dfrac{${a+b} \\cdot ${h}}{2} = \\dfrac{${(a+b)*h}}{2} = ${S}`
  return {
    latex: `a = ${a},\\; b = ${b},\\; h = ${h},\\; S_{\\text{трапеции}} = ?`,
    answer: S,
    hint,
  }
}

// Block 4 — Площадь параллелограмма: S = a·h
export function genBlock4(): GeneratedProblem {
  const a = rnd(5, 14)
  const h = rnd(3, 9)
  const S = a * h
  const hint = `S = ${a} \\cdot ${h} = ${S}`
  return {
    latex: `a = ${a},\\; h = ${h},\\; S_{\\text{параллелограмма}} = ?`,
    answer: S,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4]
