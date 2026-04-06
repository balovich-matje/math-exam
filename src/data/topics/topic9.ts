import { TopicData } from '../../types'

const topic9: TopicData = {
  id: '9',
  number: '9',
  title: 'Уравнения',
  theory: [
    {
      title: 'Линейные уравнения',
      rules: [
        'Линейное уравнение: ax + b = 0 \\Rightarrow x = -\\dfrac{b}{a}.',
        'Переносим слагаемые с x влево, числа — вправо, меняя знак.',
        'Если есть скобки — раскрываем. Если дроби — умножаем на НОК знаменателей.',
      ],
      examples: [
        {
          latex: '7x + 6 = 3x \\Rightarrow 4x = -6 \\Rightarrow x = -1{,}5',
          explanation: 'Переносим 3x влево, 6 вправо: 7x − 3x = −6.',
        },
        {
          latex: '2(x + 5) = -9 \\Rightarrow 2x + 10 = -9 \\Rightarrow 2x = -19 \\Rightarrow x = -9{,}5',
          explanation: 'Раскрываем скобки, переносим 10, делим.',
        },
      ],
    },
    {
      title: 'Квадратные уравнения',
      rules: [
        'ax^2 + bx + c = 0. Дискриминант: D = b^2 - 4ac.',
        'D > 0: два корня x_{1,2} = \\dfrac{-b \\pm \\sqrt{D}}{2a}.',
        'D = 0: один корень x = -\\dfrac{b}{2a}. \\quad D < 0: нет корней.',
        'Теорема Виета: x_1 + x_2 = -\\dfrac{b}{a}, \\quad x_1 \\cdot x_2 = \\dfrac{c}{a}.',
      ],
      examples: [
        {
          latex: 'x^2 - 9x + 18 = 0 \\Rightarrow D = 81 - 72 = 9 \\Rightarrow x = \\dfrac{9 \\pm 3}{2} \\Rightarrow x_1 = 3, \\; x_2 = 6',
          explanation: 'Находим D, затем два корня по формуле.',
        },
      ],
    },
    {
      title: 'Уравнения, сводимые к квадратным',
      rules: [
        'ax^2 = bx \\Rightarrow x(ax - b) = 0 \\Rightarrow x = 0 или x = \\dfrac{b}{a}.',
        'x^2 = c \\Rightarrow x = \\pm\\sqrt{c} (при c > 0).',
      ],
      examples: [
        {
          latex: '9x^2 = 54x \\Rightarrow 9x^2 - 54x = 0 \\Rightarrow 9x(x - 6) = 0 \\Rightarrow x = 0 \\text{ или } x = 6',
          explanation: 'Выносим общий множитель 9x за скобки.',
        },
      ],
    },
  ],
  practice: [
    {
      id: 1,
      text: 'Найдите корень уравнения:',
      latex: '-x - 7 = x',
      answer: -3.5,
    },
    {
      id: 2,
      text: 'Найдите корень уравнения:',
      latex: '4(x - 6) = 5',
      answer: 7.25,
    },
    {
      id: 3,
      text: 'Решите уравнение. Если корней несколько, запишите меньший:',
      latex: 'x^2 - 16 = 0',
      answer: -4,
    },
  ],
  test: [
    {
      id: 1,
      text: 'Найдите корень уравнения:',
      latex: '7 + 8x = -2x - 5',
      answer: -1.2,
    },
    {
      id: 2,
      text: 'Найдите корень уравнения:',
      latex: '3 + 4x = 9x - 11',
      answer: 2.8,
    },
    {
      id: 3,
      text: 'Решите уравнение. Если корней несколько, запишите меньший:',
      latex: '9x^2 = 54x',
      answer: 0,
    },
    {
      id: 4,
      text: 'Решите уравнение. Если корней несколько, запишите меньший:',
      latex: 'x^2 - 9x + 18 = 0',
      answer: 3,
    },
    {
      id: 5,
      text: 'Найдите корень уравнения:',
      latex: '10(x - 9) = 7',
      answer: 9.7,
    },
  ],
}

export default topic9
