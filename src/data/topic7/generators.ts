import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

// Block 1 — Дробь между целыми: найти целую часть p/q
export function genBlock1(): GeneratedProblem {
  let p: number, q: number
  do {
    p = rnd(10, 99)
    q = rnd(3, 9)
  } while (p % q === 0)
  const answer = Math.floor(p / q)
  const next = answer + 1
  const hint = `${answer} \\cdot ${q} = ${answer * q} < ${p} < ${next * q} = ${next} \\cdot ${q}, \\text{ значит } \\left\\lfloor \\dfrac{${p}}{${q}} \\right\\rfloor = ${answer}`
  return {
    latex: `\\text{Целая часть } \\dfrac{${p}}{${q}} = ?`,
    answer,
    hint,
  }
}

// Block 2 — Корень между целыми: найти целую часть √n
export function genBlock2(): GeneratedProblem {
  const perfectSquares = new Set([1,4,9,16,25,36,49,64,81,100,121])
  let n: number
  do {
    n = rnd(10, 120)
  } while (perfectSquares.has(n))
  const a = Math.floor(Math.sqrt(n))
  const b = a + 1
  const hint = `${a}^2 = ${a*a} < ${n} < ${b*b} = ${b}^2, \\text{ значит } \\lfloor\\sqrt{${n}}\\rfloor = ${a}`
  return {
    latex: `\\text{Целая часть } \\sqrt{${n}} = ?`,
    answer: a,
    hint,
  }
}

// Block 3 — Количество целых между двумя корнями
export function genBlock3(): GeneratedProblem {
  const perfectSquares = new Set([1,4,9,16,25,36,49,64,81,100,121,144])
  let m: number, n: number, sqrtM: number, sqrtN: number, count: number
  for (let attempt = 0; attempt < 500; attempt++) {
    m = rnd(4, 80)
    if (perfectSquares.has(m)) continue
    sqrtM = Math.sqrt(m)
    const dist = rnd(3, 7)
    const sqrtNTarget = sqrtM + dist
    n = Math.round(sqrtNTarget * sqrtNTarget)
    if (perfectSquares.has(n)) continue
    sqrtN = Math.sqrt(n)
    // count integers strictly between sqrtM and sqrtN
    const lo = Math.floor(sqrtM) + 1
    const hi = Math.ceil(sqrtN) - 1
    count = hi >= lo ? hi - lo + 1 : 0
    if (count >= 2 && count <= 8) break
  }
  const lo = Math.floor(sqrtM!) + 1
  const hi = Math.ceil(sqrtN!) - 1
  const hint = `\\sqrt{${m!}} \\approx ${sqrtM!.toFixed(2)},\\; \\sqrt{${n!}} \\approx ${sqrtN!.toFixed(2)}.\\; \\text{Целые: } ${lo}, \\ldots, ${hi} \\Rightarrow ${count!} \\text{ чисел}`
  return {
    latex: `\\text{Целых чисел строго между } \\sqrt{${m!}} \\text{ и } \\sqrt{${n!}}`,
    answer: count!,
    hint,
  }
}

// Block 4 — Отрицательная дробь между целыми
export function genBlock4(): GeneratedProblem {
  let p: number, q: number
  do {
    p = rnd(10, 80)
    q = rnd(3, 7)
  } while (p % q === 0)
  // floor(-p/q) = -ceil(p/q)
  const answer = Math.floor(-p / q)
  const next = answer + 1
  const hint = `${answer} = -${-answer} \\le -\\dfrac{${p}}{${q}} < ${next},\\text{ значит целая часть } = ${answer}`
  return {
    latex: `\\text{Целая часть } \\left(-\\dfrac{${p}}{${q}}\\right) = ?`,
    answer,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4]
