import { BlockTopicData } from '../../types'
import blocks from '../topic11/blocks'
import { GENERATORS } from '../topic11/generators'

const topic11: BlockTopicData = {
  id: '11',
  number: '11',
  title: 'Графики функций',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic11
