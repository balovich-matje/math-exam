import { BlockTopicData } from '../../types'
import blocks from '../topic15/blocks'
import { GENERATORS } from '../topic15/generators'

const topic15: BlockTopicData = {
  id: '15',
  number: '15',
  title: 'Треугольники, четырёхугольники, многоугольники',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic15
