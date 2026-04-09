import { BlockTopicData } from '../../types'
import blocks from '../topic6/blocks'
import { GENERATORS } from '../topic6/generators'

const topic6: BlockTopicData = {
  id: '6',
  number: '6',
  title: 'Дроби и степени',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic6
