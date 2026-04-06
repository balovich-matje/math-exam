import { TopicData } from '../../types'

const topic23: TopicData = {
  id: '23',
  number: '23',
  title: 'Геометрические задачи на вычисление',
  wip: 'На ОГЭ требуется полное решение (Часть 2). Формат заданий может измениться.',
  theory: [
    {
      title: 'Касательная и окружность',
      rules: [
        'Касательная перпендикулярна радиусу: CA \\perp OA.',
        'Угол между касательной и хордой равен половине дуги.',
        '\\angle ACO = 90° - \\dfrac{\\text{дуга } AD}{2}.',
      ],
      examples: [
        {
          latex: '\\text{Дуга } AD = 100° \\Rightarrow \\angle AOD = 100° \\Rightarrow \\angle ACO = 90° - 50° = 40°',
          explanation: 'OA ⊥ CA (касательная). В △OAC: ∠OAC=90°, ∠AOC=50°, ∠ACO=40°.',
        },
      ],
    },
    {
      title: 'Подобные треугольники',
      rules: [
        'Если AB \\parallel DC, то △ABM \\sim △DCM (по двум углам).',
        'Отношение сторон: \\dfrac{AM}{MC} = \\dfrac{AB}{DC}.',
      ],
      examples: [
        {
          latex: 'AB = 16, \\; DC = 24, \\; AC = 25 \\Rightarrow \\dfrac{AM}{MC} = \\dfrac{16}{24} = \\dfrac{2}{3} \\Rightarrow MC = 15',
          explanation: 'AM + MC = 25 и AM/MC = 2/3. Откуда AM = 10, MC = 15.',
        },
      ],
    },
    {
      title: 'Высота к гипотенузе',
      rules: [
        'В прямоугольном треугольнике высота h к гипотенузе: h = \\dfrac{a \\cdot b}{c}.',
        'Проекции катетов на гипотенузу: a^2 = c_a \\cdot c, \\; b^2 = c_b \\cdot c.',
        'AB = \\sqrt{AH \\cdot AC} — среднее геометрическое.',
      ],
      examples: [
        {
          latex: 'a = 20, \\; c = 52 \\Rightarrow b = \\sqrt{52^2 - 20^2} = 48 \\Rightarrow h = \\dfrac{20 \\cdot 48}{52} \\approx 18{,}46',
          explanation: 'Находим второй катет по Пифагору, затем высоту по формуле.',
        },
      ],
    },
  ],
  practice: [
    {
      id: 1,
      text: 'Найдите ∠ACO, если CA — касательная, O — центр, дуга AD = 100°. Ответ в градусах.',
      latex: '\\angle ACO = 90° - \\dfrac{100°}{2}',
      answer: 40,
    },
    {
      id: 2,
      text: 'AB ∥ DC, пересекаются в M. AB=16, DC=24, AC=25. Найдите MC.',
      latex: '\\dfrac{AM}{MC} = \\dfrac{AB}{DC} = \\dfrac{16}{24}',
      answer: 15,
    },
    {
      id: 3,
      text: 'Катет и гипотенуза: 6 и 10. Найдите высоту к гипотенузе.',
      latex: 'h = \\dfrac{6 \\cdot 8}{10}',
      answer: 4.8,
    },
  ],
  test: [
    {
      id: 1,
      text: 'Найдите ∠ACO: CA — касательная, O — центр, дуга AD = 140°.',
      latex: '\\angle ACO = 90° - \\dfrac{140°}{2}',
      answer: 20,
    },
    {
      id: 2,
      text: 'AB ∥ DC, пересекаются в M. AB=10, DC=25, AC=56. Найдите MC.',
      latex: '\\dfrac{AM}{MC} = \\dfrac{10}{25} = \\dfrac{2}{5}',
      answer: 40,
    },
    {
      id: 3,
      text: 'AH = 5, AC = 20 (H — основание высоты из прямого угла B). Найдите AB.',
      latex: 'AB = \\sqrt{AH \\cdot AC} = \\sqrt{5 \\cdot 20}',
      answer: 10,
    },
    {
      id: 4,
      text: 'AH = 10, AC = 40. Найдите AB.',
      latex: 'AB = \\sqrt{10 \\cdot 40}',
      answer: 20,
    },
    {
      id: 5,
      text: 'AD ⊥ медиане BM и делит её пополам. AB = 4. Найдите AC.',
      latex: 'AC = 2 \\cdot AB = 2 \\cdot 4',
      answer: 8,
    },
  ],
}

export default topic23
