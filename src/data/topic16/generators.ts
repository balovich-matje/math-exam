import { GeneratedProblem } from '../../types'

function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Block 1 — Радиус из длины окружности: C = 2πr, дано C/π = 2r
export function genBlock1(): GeneratedProblem {
  const r = rnd(3, 12)
  const C_over_pi = 2 * r  // C = 2πr → C/π = 2r
  const hint = `C = 2\\pi r \\Rightarrow r = \\dfrac{C}{2\\pi} = \\dfrac{${C_over_pi}\\pi}{2\\pi} = ${r}`
  return {
    latex: `C = ${C_over_pi}\\pi,\\; r = ?`,
    answer: r,
    hint,
  }
}

// Block 2 — Площадь круга S/π = r²
export function genBlock2(): GeneratedProblem {
  const r = rnd(2, 10)
  const answer = r * r
  const hint = `S = \\pi r^2 \\Rightarrow \\dfrac{S}{\\pi} = r^2 = ${r}^2 = ${answer}`
  return {
    latex: `r = ${r},\\; S/\\pi = ?`,
    answer,
    hint,
  }
}

// Block 3 — Длина дуги / π: arc = (angle/360)·2πr → arc/π = angle·r/180
export function genBlock3(): GeneratedProblem {
  const r = rnd(4, 12)
  const angle = pick([60, 90, 120, 180])
  const answer = angle * r / 180
  const hint = `\\text{Дуга} = \\dfrac{${angle}}{360} \\cdot 2\\pi \\cdot ${r} = \\dfrac{${angle} \\cdot ${r}}{180}\\pi \\Rightarrow \\text{дуга}/\\pi = ${answer}`
  return {
    latex: `r = ${r},\\; \\text{угол} = ${angle}°,\\; \\text{длина дуги} / \\pi = ?`,
    answer,
    hint,
  }
}

// Block 4 — Диаметр описанной окружности прямоугольного треугольника = гипотенуза
export function genBlock4(): GeneratedProblem {
  const triples: [number, number, number][] = [
    [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]
  ]
  const [a, b, hyp] = pick(triples)
  const hint = `\\text{Гипотенуза} = \\text{диаметр описанной окружности} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a*a+b*b}} = ${hyp}`
  return {
    latex: `a = ${a},\\; b = ${b},\\; \\text{диаметр описанной окружности} = ?`,
    answer: hyp,
    hint,
  }
}

export const GENERATORS = [genBlock1, genBlock2, genBlock3, genBlock4]
