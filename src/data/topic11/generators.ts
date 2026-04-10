import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function signedB(b: number): string {
  return b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
}

// Block 1 — y = kx + b, найти y при заданном x
export function genBlock1(): GeneratedProblem {
  let k: number
  do { k = rnd(-5, 5) } while (k === 0)
  const b = rnd(-8, 8)
  let x_val: number
  do { x_val = rnd(-5, 5) } while (x_val === 0)
  const y = k * x_val + b
  const hint = `y = ${k} \\cdot (${x_val}) ${signedB(b)} = ${k * x_val} ${signedB(b)} = ${y}`
  return {
    latex: `y = ${k}x ${signedB(b)}, \\quad x = ${x_val}`,
    answer: y,
    hint,
  }
}

// Block 2 — y = kx + b = y_val, найти x
export function genBlock2(): GeneratedProblem {
  const k = rnd(2, 6)
  const b = rnd(-8, 8)
  let x_val: number
  do { x_val = rnd(-5, 5) } while (x_val === 0)
  const y_val = k * x_val + b
  const hint = `${k}x = ${y_val} - (${b}) = ${y_val - b},\\; x = \\dfrac{${y_val - b}}{${k}} = ${x_val}`
  return {
    latex: `y = ${k}x ${signedB(b)} = ${y_val},\\; x = ?`,
    answer: x_val,
    hint,
  }
}

// Block 3 — y = ax², найти y
export function genBlock3(): GeneratedProblem {
  const a = rnd(1, 4)
  let x_val: number
  do { x_val = rnd(-4, 4) } while (x_val === 0)
  const y = a * x_val * x_val
  const hint = `y = ${a} \\cdot (${x_val})^2 = ${a} \\cdot ${x_val * x_val} = ${y}`
  return {
    latex: `y = ${a}x^2, \\quad x = ${x_val}`,
    answer: y,
    hint,
  }
}

// Block 4 — y = k/x, найти y (k делится на x_val нацело)
export function genBlock4(): GeneratedProblem {
  const kOptions = [2, 4, 6, 8, 10, 12, 15, 18, 20]
  const k = pick(kOptions)
  // find divisors of k
  const divisors: number[] = []
  for (let d = 1; d <= k; d++) {
    if (k % d === 0) {
      divisors.push(d)
      if (d !== k / d) divisors.push(-(k / d))
    }
  }
  const x_val = pick(divisors.filter(d => d !== 0))
  const y = k / x_val
  const hint = `y = \\dfrac{${k}}{${x_val}} = ${y}`
  return {
    latex: `y = \\dfrac{${k}}{x}, \\quad x = ${x_val}`,
    answer: y,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4]
