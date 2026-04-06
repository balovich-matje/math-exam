import { TopicData } from '../../types'

const topic17: TopicData = {
  id: '17',
  number: '17',
  title: 'Площади фигур',
  theory: [
    {
      title: 'Площадь параллелограмма и его видов',
      rules: [
        'S_{\\text{пар}} = a \\cdot h — основание на высоту.',
        'S_{\\text{пр}} = a \\cdot b — стороны прямоугольника.',
        'S_{\\text{ромб}} = \\dfrac{d_1 \\cdot d_2}{2} — полупроизведение диагоналей.',
      ],
      examples: [
        {
          latex: 'S = \\dfrac{d_1 \\cdot d_2}{2} = \\dfrac{10 \\cdot 30}{2} \\cdot \\sin 30° = 75',
          explanation: 'Для параллелограмма с диагоналями: S = ½ · d₁ · d₂ · sin α.',
        },
      ],
    },
    {
      title: 'Площадь треугольника и трапеции',
      rules: [
        'S_{\\triangle} = \\dfrac{1}{2} a \\cdot h — половина основания на высоту.',
        'S_{\\text{трап}} = \\dfrac{(a + b)}{2} \\cdot h — полусумма оснований на высоту.',
      ],
      examples: [
        {
          latex: 'S = \\dfrac{(3 + 7)}{2} \\cdot 4 = \\dfrac{10}{2} \\cdot 4 = 20',
          explanation: 'Трапеция с основаниями 3 и 7, высота 4.',
        },
      ],
    },
  ],
  practice: [
    {
      id: 1,
      text: 'Сторона ромба 9, расстояние от центра до стороны 1. Найдите площадь.',
      latex: 'S = 4 \\cdot \\dfrac{1}{2} \\cdot a \\cdot h = 2 \\cdot 9 \\cdot 1',
      answer: 18,
    },
    {
      id: 2,
      text: 'Диагонали параллелограмма 10 и 30, угол между ними 30°. Найдите площадь.',
      latex: 'S = \\dfrac{1}{2} \\cdot 10 \\cdot 30 \\cdot \\sin 30°',
      answer: 75,
    },
    {
      id: 3,
      text: 'Сторона ромба 12, расстояние от центра до стороны 2. Найдите площадь.',
      latex: 'S = 2 \\cdot 12 \\cdot 2',
      answer: 48,
    },
  ],
  test: [
    {
      id: 1,
      text: 'Стороны прямоугольника 5 и 8. Найдите площадь.',
      latex: 'S = 5 \\cdot 8',
      answer: 40,
    },
    {
      id: 2,
      text: 'Диагонали ромба 12 и 16. Найдите площадь.',
      latex: 'S = \\dfrac{12 \\cdot 16}{2}',
      answer: 96,
    },
    {
      id: 3,
      text: 'Основания трапеции 6 и 10, высота 5. Найдите площадь.',
      latex: 'S = \\dfrac{(6 + 10)}{2} \\cdot 5',
      answer: 40,
    },
    {
      id: 4,
      text: 'Диагонали параллелограмма 5 и 28, угол между ними 30°. Найдите площадь.',
      latex: 'S = \\dfrac{1}{2} \\cdot 5 \\cdot 28 \\cdot \\sin 30°',
      answer: 35,
    },
    {
      id: 5,
      text: 'Сторона ромба 12, расстояние от центра до стороны 4. Найдите площадь.',
      latex: 'S = 2 \\cdot 12 \\cdot 4',
      answer: 96,
    },
  ],
}

export default topic17
