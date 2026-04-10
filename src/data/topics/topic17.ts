import { BlockTopicData } from '../../types'
import blocks from '../topic17/blocks'
import { GENERATORS } from '../topic17/generators'

const topic17: BlockTopicData = {
  id: '17',
  number: '17',
  title: 'Площади фигур',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic17
