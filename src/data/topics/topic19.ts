import { BlockTopicData } from '../../types'
import blocks from '../topic19/blocks'
import { GENERATORS } from '../topic19/generators'

const topic19: BlockTopicData = {
  id: '19',
  number: '19',
  title: 'Анализ геометрических высказываний',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic19
