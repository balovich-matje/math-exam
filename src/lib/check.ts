export function parseAnswer(input: string): number | null {
  const normalized = input.trim().replace(',', '.')
  if (normalized === '' || normalized === '-') return null
  const num = parseFloat(normalized)
  return isNaN(num) ? null : num
}

export function isCorrect(userAnswer: number, correctAnswer: number): boolean {
  return Math.abs(userAnswer - correctAnswer) < 0.01
}
