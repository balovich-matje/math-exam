import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Block 1 — Скорость: s = v·t
export function genBlock1(): GeneratedProblem {
  const v = rnd(40, 120, 10)
  const t = rnd(1, 5)
  const s = v * t
  const hint = `s = v \\cdot t = ${v} \\cdot ${t} = ${s} \\text{ км}`
  return {
    latex: `v = ${v} \\text{ км/ч},\\; t = ${t} \\text{ ч.}\\; s = ?`,
    answer: s,
    hint,
  }
}

// Block 2 — Найти время: t = s/v
export function genBlock2(): GeneratedProblem {
  const v = rnd(40, 100, 10)
  const tFactor = rnd(1, 5)
  const s = v * tFactor
  const t = s / v
  const hint = `t = \\dfrac{s}{v} = \\dfrac{${s}}{${v}} = ${t} \\text{ ч}`
  return {
    latex: `v = ${v} \\text{ км/ч},\\; s = ${s} \\text{ км.}\\; t = ?`,
    answer: t,
    hint,
  }
}

// Block 3 — Проценты: p% от N
export function genBlock3(): GeneratedProblem {
  const N = rnd(100, 500, 50)
  const p = pick([5, 10, 15, 20, 25, 30, 40, 50])
  const result = N * p / 100
  const hint = `${p}\\% \\text{ от } ${N} = \\dfrac{${N} \\cdot ${p}}{100} = ${result}`
  return {
    latex: `${p}\\% \\text{ от } ${N}`,
    answer: result,
    hint,
  }
}

// Block 4 — Обратный процент: N = p% от X, найти X
export function genBlock4(): GeneratedProblem {
  const p = pick([10, 20, 25, 50])
  const X = rnd(100, 400, 100)
  const N = X * p / 100
  const hint = `X = \\dfrac{${N}}{${p}\\%} = \\dfrac{${N} \\cdot 100}{${p}} = ${X}`
  return {
    latex: `\\text{Число } ${N} \\text{ составляет } ${p}\\% \\text{ от числа. Найди число.}`,
    answer: X,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4]
