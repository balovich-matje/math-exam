import { BlockTopicData } from '../../types'
import blocks from '../topic18/blocks'
import { GENERATORS } from '../topic18/generators'

const topic18: BlockTopicData = {
  id: '18',
  number: '18',
  title: 'Фигуры на квадратной решётке',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic18
