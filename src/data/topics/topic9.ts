import { BlockTopicData } from '../../types'
import blocks from '../topic9/blocks'
import { GENERATORS } from '../topic9/generators'

const topic9: BlockTopicData = {
  id: '9',
  number: '9',
  title: 'Уравнения',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic9
