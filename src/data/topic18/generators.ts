import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

// Block 1 — Площадь прямоугольника на решётке: S = w·h
export function genBlock1(): GeneratedProblem {
  const w = rnd(2, 6)
  const h = rnd(2, 5)
  const S = w * h
  const hint = `S = ${w} \\cdot ${h} = ${S}`
  return {
    latex: `\\text{Прямоугольник } ${w} \\times ${h} \\text{ на решётке, } S = ?`,
    answer: S,
    hint,
  }
}

// Block 2 — Площадь прямоугольного треугольника на решётке: S = a·b/2
export function genBlock2(): GeneratedProblem {
  let a: number, b: number
  do {
    a = rnd(2, 6)
    b = rnd(2, 5)
  } while ((a * b) % 2 !== 0)  // ensure integer result
  const S = a * b / 2
  const hint = `S = \\dfrac{${a} \\cdot ${b}}{2} = \\dfrac{${a*b}}{2} = ${S}`
  return {
    latex: `\\text{Прямоугольный треугольник, катеты } ${a} \\text{ и } ${b},\\; S = ?`,
    answer: S,
    hint,
  }
}

// Block 3 — Формула Пика: S = I + B/2 - 1
export function genBlock3(): GeneratedProblem {
  const I = rnd(2, 6)
  const B = rnd(4, 10, 2)  // even B
  const S = I + B / 2 - 1
  const hint = `S = I + \\dfrac{B}{2} - 1 = ${I} + \\dfrac{${B}}{2} - 1 = ${I} + ${B/2} - 1 = ${S}`
  return {
    latex: `I = ${I},\\; B = ${B},\\; S = ?\\; (\\text{формула Пика})`,
    answer: S,
    hint,
  }
}

// Block 4 — Периметр прямоугольника на решётке: P = 2(a+b)
export function genBlock4(): GeneratedProblem {
  const a = rnd(2, 8)
  const b = rnd(2, 6)
  const P = 2 * (a + b)
  const hint = `P = 2(${a} + ${b}) = 2 \\cdot ${a+b} = ${P}`
  return {
    latex: `${a} \\times ${b} \\text{ на решётке, периметр} = ?`,
    answer: P,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4]
