import { GeneratedProblem } from '../../types'

// ── Math helpers ──────────────────────────────────────────────────────────

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b)
  while (b > 0) { const t = b; b = a % b; a = t }
  return a || 1
}
function lcm(a: number, b: number): number {
  return (Math.abs(a) / gcd(a, b)) * Math.abs(b)
}
function reduce(num: number, den: number): [number, number] {
  const g = gcd(Math.abs(num), Math.abs(den))
  return [num / g, den / g]
}
function ri(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function rnd(n: number, places = 4) {
  return Math.round(n * 10 ** places) / 10 ** places
}

// ── LaTeX helpers ─────────────────────────────────────────────────────────

function frac(n: number, d: number) { return `\\dfrac{${n}}{${d}}` }
function mixed(w: number, n: number, d: number) { return `${w}\\,${frac(n, d)}` }
// Decimal → LaTeX with Russian comma
function dec(n: number) { return n.toString().replace('.', '{,}') }

// ── Fraction pools ────────────────────────────────────────────────────────

// Denominators whose only prime factors are 2 and 5 → always terminating decimal
const SAFE_D  = [2, 4, 5, 10]       // for simple fractions (blocks 1–2)
const MIXED_D = [2, 4, 5]           // for mixed numbers (blocks 3–4), keep answers tidy

function randFrac(denoms = SAFE_D): [number, number] {
  const b = pick(denoms)
  const a = ri(1, b - 1)
  return reduce(a, b)
}

// ── Block 1: Addition / Subtraction of simple fractions ───────────────────

export function genBlock1(): GeneratedProblem {
  for (let i = 0; i < 300; i++) {
    const [a, b] = randFrac()
    const [c, d] = randFrac()
    const add = Math.random() > 0.5
    const L = lcm(b, d)
    const num = add
      ? a * (L / b) + c * (L / d)
      : a * (L / b) - c * (L / d)
    if (num <= 0) continue
    const [rn, rd] = reduce(num, L)
    const answer = rnd(rn / rd)
    const op = add ? '+' : '-'
    const hint = `НОК(${b}, ${d}) = ${L}.  ${frac(a * (L / b), L)} ${op} ${frac(c * (L / d), L)} = ${frac(num, L)} = ${frac(rn, rd)}`
    return { latex: `${frac(a, b)} ${op} ${frac(c, d)}`, answer, hint }
  }
  return { latex: `${frac(1, 4)} + ${frac(3, 4)}`, answer: 1, hint: `${frac(1, 4)} + ${frac(3, 4)} = ${frac(4, 4)} = 1` }
}

// ── Block 2: Multiplication / Division of simple fractions ────────────────

export function genBlock2(): GeneratedProblem {
  for (let i = 0; i < 300; i++) {
    const [a, b] = randFrac()
    const [c, d] = randFrac()
    const mul = Math.random() > 0.5
    const [rn, rd] = mul ? reduce(a * c, b * d) : reduce(a * d, b * c)
    if (rn <= 0 || rd <= 0) continue
    const answer = rnd(rn / rd)
    const op = mul ? '\\times' : '\\div'
    const hint = mul
      ? `${a}·${c} = ${a * c}, ${b}·${d} = ${b * d} → ${frac(a * c, b * d)} = ${frac(rn, rd)}`
      : `${frac(a, b)} \\div ${frac(c, d)} = ${frac(a, b)} \\times ${frac(d, c)} = ${frac(a * d, b * c)} = ${frac(rn, rd)}`
    return { latex: `${frac(a, b)} ${op} ${frac(c, d)}`, answer, hint }
  }
  return { latex: `${frac(1, 2)} \\times ${frac(1, 2)}`, answer: 0.25, hint: `${frac(1, 4)} = 0{,}25` }
}

// ── Block 3: Addition / Subtraction of mixed numbers ──────────────────────

export function genBlock3(): GeneratedProblem {
  for (let i = 0; i < 300; i++) {
    const w1 = ri(1, 4); const [a, b] = randFrac(MIXED_D)
    const w2 = ri(1, 4); const [c, d] = randFrac(MIXED_D)
    const add = Math.random() > 0.5
    const n1 = w1 * b + a; const n2 = w2 * d + c
    const L = lcm(b, d)
    const num = add ? n1 * (L / b) + n2 * (L / d) : n1 * (L / b) - n2 * (L / d)
    if (num <= 0) continue
    const [rn, rd] = reduce(num, L)
    const answer = rnd(rn / rd)
    if (answer > 16) continue
    const op = add ? '+' : '-'
    const hint = `Перевод: ${frac(n1, b)} ${op} ${frac(n2, d)} → ${frac(num, L)} = ${frac(rn, rd)} = ${dec(answer)}`
    return { latex: `${mixed(w1, a, b)} ${op} ${mixed(w2, c, d)}`, answer, hint }
  }
  return { latex: `1\\,${frac(1, 2)} + 1\\,${frac(1, 2)}`, answer: 3, hint: `${frac(3, 2)} + ${frac(3, 2)} = ${frac(6, 2)} = 3` }
}

// ── Block 4: Multiplication / Division of mixed numbers ───────────────────

export function genBlock4(): GeneratedProblem {
  for (let i = 0; i < 300; i++) {
    const w1 = ri(1, 3); const [a, b] = randFrac(MIXED_D)
    const w2 = ri(1, 3); const [c, d] = randFrac(MIXED_D)
    const mul = Math.random() > 0.5
    const n1 = w1 * b + a; const n2 = w2 * d + c
    const [rn, rd] = mul ? reduce(n1 * n2, b * d) : reduce(n1 * d, b * n2)
    if (rn <= 0 || rd <= 0) continue
    const answer = rnd(rn / rd)
    if (answer > 12) continue
    const op = mul ? '\\times' : '\\div'
    const hint = mul
      ? `${frac(n1, b)} \\times ${frac(n2, d)} = ${frac(n1 * n2, b * d)} = ${frac(rn, rd)} = ${dec(answer)}`
      : `${frac(n1, b)} \\div ${frac(n2, d)} = ${frac(n1, b)} \\times ${frac(d, n2)} = ${frac(rn, rd)} = ${dec(answer)}`
    return { latex: `${mixed(w1, a, b)} ${op} ${mixed(w2, c, d)}`, answer, hint }
  }
  return { latex: `1\\,${frac(1, 2)} \\times 2`, answer: 3, hint: `${frac(3, 2)} \\times 2 = 3` }
}

// ── Block 5: Addition / Subtraction of decimal fractions ──────────────────

export function genBlock5(): GeneratedProblem {
  const tenths  = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => x / 10)
  const hundths = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map(x => x / 100)
  const pool = [...tenths, ...hundths]
  const w1 = ri(0, 9); const f1 = pick(pool)
  const w2 = ri(0, 9); const f2 = pick(pool)
  let a = rnd(w1 + f1, 2); let b = rnd(w2 + f2, 2)
  const add = Math.random() > 0.5
  if (!add && a < b) [a, b] = [b, a]
  const answer = rnd(add ? a + b : a - b, 2)
  const op = add ? '+' : '-'
  return {
    latex: `${dec(a)} ${op} ${dec(b)}`,
    answer,
    hint: `Выровни запятые: ${dec(a)} ${op} ${dec(b)} = ${dec(answer)}`
  }
}

// ── Block 6: Multiplication / Division of decimal fractions ───────────────

export function genBlock6(): GeneratedProblem {
  const vals = [0.2, 0.4, 0.5, 0.8, 1.2, 1.5, 2.4, 2.5, 3.2, 0.25, 0.75, 1.6]
  const mul = Math.random() > 0.5
  if (mul) {
    const a = pick(vals); const b = pick(vals)
    const answer = rnd(a * b, 3)
    const digA = (a.toString().split('.')[1] || '').length
    const digB = (b.toString().split('.')[1] || '').length
    const hint = `${a * 10 ** digA} × ${b * 10 ** digB} = ${a * b * 10 ** (digA + digB)}, сдвинь запятую на ${digA + digB} знак${digA + digB === 1 ? '' : 'а'} → ${dec(answer)}`
    return { latex: `${dec(a)} \\times ${dec(b)}`, answer, hint }
  } else {
    const divisors = [0.2, 0.4, 0.5, 1.2, 1.5, 2.5]
    const b = pick(divisors)
    const a = pick(vals)
    const dividend = rnd(a * b, 3)
    const digB = (b.toString().split('.')[1] || '').length
    const factor = 10 ** digB
    const hint = `Умножь оба на ${factor}: ${dec(dividend * factor)} ÷ ${b * factor} = ${dec(a)}`
    return { latex: `${dec(dividend)} \\div ${dec(b)}`, answer: a, hint }
  }
}

// ── Block 7: Decimal × / ÷ power of 10 ───────────────────────────────────

export function genBlock7(): GeneratedProblem {
  const bases  = [1.5, 2.3, 4.7, 0.56, 3.14, 12.5, 0.075, 5.6, 0.008, 1.23, 0.42, 6.7]
  const base   = pick(bases)
  const n      = pick([1, 2, 3])
  const mul    = Math.random() > 0.5
  if (mul) {
    const answer = rnd(base * 10 ** n)
    const dir = `вправо на ${n}`
    return {
      latex: `${dec(base)} \\times 10^{${n}}`,
      answer,
      hint: `Двигаем запятую ${dir}: ${dec(base)} → ${dec(answer)}`
    }
  } else {
    const answer = rnd(base / 10 ** n)
    const dir = `влево на ${n}`
    return {
      latex: `${dec(base)} \\div 10^{${n}}`,
      answer,
      hint: `Двигаем запятую ${dir}: ${dec(base)} → ${dec(answer)}`
    }
  }
}

// ── Exported array (index matches block index) ────────────────────────────

export const GENERATORS = [
  genBlock1,
  genBlock2,
  genBlock3,
  genBlock4,
  genBlock5,
  genBlock6,
  genBlock7,
] as const
