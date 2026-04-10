import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

// Block 1 — Линейное уравнение ax = b
export function genBlock1(): GeneratedProblem {
  const a = rnd(2, 9)
  let x: number
  do { x = rnd(-8, 8) } while (x === 0)
  const b = a * x
  const hint = `x = \\dfrac{${b}}{${a}} = ${x}`
  return {
    latex: `${a}x = ${b}`,
    answer: x,
    hint,
  }
}

// Block 2 — Линейное ax + b = c
export function genBlock2(): GeneratedProblem {
  const a = rnd(2, 7)
  let x: number
  do { x = rnd(-6, 6) } while (x === 0)
  const bVal = rnd(-10, 10)
  const c = a * x + bVal
  const bStr = bVal >= 0 ? `+ ${bVal}` : `- ${Math.abs(bVal)}`
  const hint = `${a}x = ${c} - (${bVal}) = ${c - bVal},\\; x = \\dfrac{${c - bVal}}{${a}} = ${x}`
  return {
    latex: `${a}x ${bStr} = ${c}`,
    answer: x,
    hint,
  }
}

// Block 3 — Линейное ax + b = cx + d
export function genBlock3(): GeneratedProblem {
  let a: number, c: number, x: number, bVal: number, d: number
  do {
    a = rnd(3, 8)
    c = rnd(1, a - 1)
    do { x = rnd(-5, 5) } while (x === 0)
    bVal = rnd(-8, 8)
    d = (a - c) * x + bVal
  } while (a === c)
  const bStr = bVal >= 0 ? `+ ${bVal}` : `- ${Math.abs(bVal)}`
  const dStr = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`
  const diff = a - c
  const rhs = d - bVal
  const hint = `(${a} - ${c})x = ${d} - (${bVal}),\\; ${diff}x = ${rhs},\\; x = ${x}`
  return {
    latex: `${a}x ${bStr} = ${c}x ${dStr}`,
    answer: x,
    hint,
  }
}

// Block 4 — Квадратное с целыми корнями: найти наибольший корень
export function genBlock4(): GeneratedProblem {
  let r1: number, r2: number
  do {
    r1 = rnd(-6, 6)
    r2 = rnd(-6, 6)
  } while (r1 === 0 || r2 === 0 || r1 === r2)
  // x² - (r1+r2)x + r1*r2 = 0
  const coefB = -(r1 + r2)  // coefficient of x
  const coefC = r1 * r2     // constant term
  const bStr = coefB >= 0 ? `+ ${coefB}` : `- ${Math.abs(coefB)}`
  const cStr = coefC >= 0 ? `+ ${coefC}` : `- ${Math.abs(coefC)}`
  const answer = Math.max(r1, r2)
  const minRoot = Math.min(r1, r2)
  const hint = `x^2 ${bStr}x ${cStr} = (x - ${r1})(x - ${r2}) = 0,\\; x_1 = ${minRoot},\\; x_2 = ${answer}`
  return {
    latex: `\\text{Найди наибольший корень: } x^2 ${bStr}x ${cStr} = 0`,
    answer,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4]
