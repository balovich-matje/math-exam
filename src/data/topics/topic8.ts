import { BlockTopicData } from '../../types'
import blocks from '../topic8/blocks'
import { GENERATORS } from '../topic8/generators'

const topic8: BlockTopicData = {
  id: '8',
  number: '8',
  title: 'Квадратные корни и степени',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic8
