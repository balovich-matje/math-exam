import { BlockTopicData } from '../../types'
import blocks from '../topic14/blocks'
import { GENERATORS } from '../topic14/generators'

const topic14: BlockTopicData = {
  id: '14',
  number: '14',
  title: 'Арифметические и геометрические прогрессии',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic14
