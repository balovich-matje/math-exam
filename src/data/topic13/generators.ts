import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

// Block 1 — Наибольшее целое решение ax < b
// Pick answer_max (1..6), then b = a * answer_max + random(1..a-1)
// So x < b/a gives max integer = answer_max
export function genBlock1(): GeneratedProblem {
  const a = rnd(2, 6)
  const answer = rnd(1, 6)
  const extra = rnd(1, a - 1)
  const b = a * answer + extra
  // Verify: b/a = answer + extra/a, floor = answer ✓
  const decimal = (b / a).toFixed(2)
  const hint = `\\dfrac{${b}}{${a}} = ${decimal}\\ldots,\\; \\text{наибольшее целое меньше } ${decimal}\\ldots \\text{ равно } ${answer}`
  return {
    latex: `${a}x < ${b}`,
    answer,
    hint,
  }
}

// Block 2 — Наименьшее целое решение ax > b
// Pick answer_min (-3..3), then b = a * answer_min - random(1..a-1)
// So x > b/a gives min integer = answer_min
export function genBlock2(): GeneratedProblem {
  const a = rnd(2, 5)
  const answer = rnd(-3, 3)
  const extra = rnd(1, a - 1)
  const b = a * answer - extra
  // Verify: b/a = answer - extra/a, so x > b/a means min integer = answer ✓
  const decimal = (b / a).toFixed(2)
  const hint = `\\dfrac{${b}}{${a}} = ${decimal}\\ldots,\\; \\text{наименьшее целое больше } ${decimal}\\ldots \\text{ равно } ${answer}`
  return {
    latex: `${a}x > ${b}`,
    answer,
    hint,
  }
}

// Block 3 — a < bx + c < d, найти количество целых решений
// Build from known answer: pick integer solutions x in [lo..hi], count = hi - lo + 1 (2..4)
export function genBlock3(): GeneratedProblem {
  let a_coef: number, c_coef: number, lo: number, hi: number, count: number
  let leftBound: number, rightBound: number
  for (let attempt = 0; attempt < 300; attempt++) {
    a_coef = 1 + Math.floor(Math.random() * 2)  // 1 or 2
    c_coef = Math.floor(Math.random() * 7) - 3   // -3..3
    lo = Math.floor(Math.random() * 5) - 1       // -1..3
    count = 2 + Math.floor(Math.random() * 3)    // 2..4
    hi = lo + count - 1
    // a_coef * x + c_coef strictly between leftBound and rightBound
    // leftBound < a_coef * lo + c_coef and rightBound > a_coef * hi + c_coef
    // pick leftBound = a_coef * lo + c_coef - random(1..3)
    const margin1 = 1 + Math.floor(Math.random() * 3)
    const margin2 = 1 + Math.floor(Math.random() * 3)
    leftBound = a_coef * lo + c_coef - margin1
    rightBound = a_coef * hi + c_coef + margin2
    // Verify no extra integers sneak in
    // x must satisfy leftBound < a_coef * x + c_coef < rightBound
    // => (leftBound - c_coef) / a_coef < x < (rightBound - c_coef) / a_coef
    const xLo = (leftBound - c_coef) / a_coef
    const xHi = (rightBound - c_coef) / a_coef
    const actualLo = Math.floor(xLo) + 1
    const actualHi = Math.ceil(xHi) - 1
    const actualCount = actualHi >= actualLo ? actualHi - actualLo + 1 : 0
    if (actualCount === count) break
  }
  const cStr = c_coef! >= 0 ? `+ ${c_coef!}` : `- ${Math.abs(c_coef!)}`
  const exprStr = a_coef! === 1 ? `x ${cStr}` : `${a_coef!}x ${cStr}`
  const xLo = (leftBound! - c_coef!) / a_coef!
  const xHi = (rightBound! - c_coef!) / a_coef!
  const hint = `${leftBound!} < ${exprStr} < ${rightBound!} \\Rightarrow ${xLo.toFixed(2)} < x < ${xHi.toFixed(2)},\\; \\text{целых: } ${count!}`
  return {
    latex: `${leftBound!} < ${exprStr} < ${rightBound!},\\; \\text{кол-во целых решений}`,
    answer: count!,
    hint,
  }
}

// Block 4 — ax + b ≤ cx + d, найти x ≤ k (k — целое)
// (a - c)x ≤ d - b → x ≤ (d - b)/(a - c)
// Pick a > c so coefficient is positive, and ensure (d-b)/(a-c) is integer
export function genBlock4(): GeneratedProblem {
  let a: number, c: number, b: number, d: number, k: number
  for (let attempt = 0; attempt < 300; attempt++) {
    a = 3 + Math.floor(Math.random() * 5)  // 3..7
    c = 1 + Math.floor(Math.random() * (a - 2))  // 1..a-2 so a-c >= 2
    const diff = a - c
    k = Math.floor(Math.random() * 7) - 2  // -2..4
    b = Math.floor(Math.random() * 11) - 5  // -5..5
    // (d - b) = diff * k → d = b + diff * k
    d = b + diff * k
    if (a !== c && Number.isInteger(k)) break
  }
  const bStr = b! >= 0 ? `+ ${b!}` : `- ${Math.abs(b!)}`
  const dStr = d! >= 0 ? `+ ${d!}` : `- ${Math.abs(d!)}`
  const hint = `(${a!} - ${c!})x \\le ${d!} - (${b!}),\\; ${a! - c!}x \\le ${d! - b!},\\; x \\le ${k!}`
  return {
    latex: `${a!}x ${bStr} \\le ${c!}x ${dStr}`,
    answer: k!,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4]
