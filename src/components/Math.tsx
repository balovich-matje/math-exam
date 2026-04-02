import katex from 'katex'

interface MathProps {
  tex: string
  display?: boolean
  className?: string
}

export default function Math({ tex, display = false, className = '' }: MathProps) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
  })

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
