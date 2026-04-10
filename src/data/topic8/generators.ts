import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Block 1 — √(a²) · √(b), где b — точный квадрат
export function genBlock1(): GeneratedProblem {
  const a = rnd(2, 9)
  const bSqrt = pick([2, 3, 4, 5])
  const b = bSqrt * bSqrt
  const answer = a * bSqrt
  const hint = `\\sqrt{${a*a}} = ${a},\\; \\sqrt{${b}} = ${bSqrt},\\; ${a} \\cdot ${bSqrt} = ${answer}`
  return {
    latex: `\\sqrt{${a*a}} \\cdot \\sqrt{${b}}`,
    answer,
    hint,
  }
}

// Block 2 — Умножение степеней: x^m · x^n = x^(m+n)
export function genBlock2(): GeneratedProblem {
  const x = rnd(2, 5)
  const m = rnd(2, 5)
  const n = rnd(2, 4)
  const answer = Math.pow(x, m + n)
  const hint = `${x}^{${m}} \\cdot ${x}^{${n}} = ${x}^{${m}+${n}} = ${x}^{${m+n}} = ${answer}`
  return {
    latex: `${x}^{${m}} \\cdot ${x}^{${n}}`,
    answer,
    hint,
  }
}

// Block 3 — Степень степени: (x^m)^n = x^(m·n)
export function genBlock3(): GeneratedProblem {
  let x: number, m: number, n: number, answer: number
  do {
    x = rnd(2, 4)
    m = rnd(2, 4)
    n = rnd(2, 3)
    answer = Math.pow(x, m * n)
  } while (answer > 10000)
  const hint = `(${x}^{${m}})^{${n}} = ${x}^{${m} \\cdot ${n}} = ${x}^{${m*n}} = ${answer}`
  return {
    latex: `(${x}^{${m}})^{${n}}`,
    answer,
    hint,
  }
}

// Block 4 — Деление степеней: x^m / x^n = x^(m-n)
export function genBlock4(): GeneratedProblem {
  let x: number, m: number, n: number, answer: number
  do {
    x = rnd(2, 5)
    n = rnd(2, 4)
    m = rnd(n + 1, n + 4)  // m > n, keep exponent difference small
    answer = Math.pow(x, m - n)
  } while (answer > 10000)
  const hint = `\\dfrac{${x}^{${m}}}{${x}^{${n}}} = ${x}^{${m}-${n}} = ${x}^{${m-n}} = ${answer}`
  return {
    latex: `\\dfrac{${x}^{${m}}}{${x}^{${n}}}`,
    answer,
    hint,
  }
}

// Block 5 — Разность квадратов с корнями: (√a - b)(√a + b) = a - b²
export function genBlock5(): GeneratedProblem {
  const nonSquarePrimes = [3, 5, 7, 11, 13, 17, 19, 23]
  const a = pick(nonSquarePrimes)
  const b = rnd(2, 4)
  const answer = a - b * b
  const hint = `(\\sqrt{${a}} - ${b})(\\sqrt{${a}} + ${b}) = (\\sqrt{${a}})^2 - ${b}^2 = ${a} - ${b*b} = ${answer}`
  return {
    latex: `(\\sqrt{${a}} - ${b})(\\sqrt{${a}} + ${b})`,
    answer,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4, genBlock5]
