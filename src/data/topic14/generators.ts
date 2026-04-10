import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

// Block 1 — n-й член арифметической прогрессии: an = a1 + (n-1)*d
export function genBlock1(): GeneratedProblem {
  const a1 = rnd(-5, 10)
  const d = rnd(2, 7)
  const n = rnd(5, 10)
  const an = a1 + (n - 1) * d
  const hint = `a_{${n}} = ${a1} + (${n} - 1) \\cdot ${d} = ${a1} + ${(n-1)*d} = ${an}`
  return {
    latex: `a_1 = ${a1},\\; d = ${d},\\; n = ${n},\\; a_n = ?`,
    answer: an,
    hint,
  }
}

// Block 2 — Сумма арифметической прогрессии: Sn = n*(2*a1 + (n-1)*d)/2
export function genBlock2(): GeneratedProblem {
  const a1 = rnd(1, 5)
  const d = rnd(1, 4)
  const n = rnd(5, 8)
  const Sn = n * (2 * a1 + (n - 1) * d) / 2
  const hint = `S_{${n}} = \\dfrac{${n}(2 \\cdot ${a1} + (${n}-1) \\cdot ${d})}{2} = \\dfrac{${n} \\cdot ${2*a1 + (n-1)*d}}{2} = ${Sn}`
  return {
    latex: `a_1 = ${a1},\\; d = ${d},\\; n = ${n},\\; S_n = ?`,
    answer: Sn,
    hint,
  }
}

// Block 3 — n-й член геометрической прогрессии: bn = b1 * q^(n-1)
export function genBlock3(): GeneratedProblem {
  const b1 = rnd(1, 4)
  const q = rnd(2, 3)
  const n = rnd(3, 5)
  const bn = b1 * Math.pow(q, n - 1)
  const hint = `b_{${n}} = ${b1} \\cdot ${q}^{${n}-1} = ${b1} \\cdot ${q}^{${n-1}} = ${b1} \\cdot ${Math.pow(q, n-1)} = ${bn}`
  return {
    latex: `b_1 = ${b1},\\; q = ${q},\\; n = ${n},\\; b_n = ?`,
    answer: bn,
    hint,
  }
}

// Block 4 — Найти d из двух членов: d = (an - a1)/(n-1)
export function genBlock4(): GeneratedProblem {
  const a1 = rnd(1, 8)
  const d = rnd(2, 5)
  const n = rnd(4, 8)
  const an = a1 + (n - 1) * d
  const hint = `d = \\dfrac{a_{${n}} - a_1}{${n} - 1} = \\dfrac{${an} - ${a1}}{${n-1}} = \\dfrac{${an - a1}}{${n-1}} = ${d}`
  return {
    latex: `a_1 = ${a1},\\; a_{${n}} = ${an},\\; d = ?`,
    answer: d,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4]
