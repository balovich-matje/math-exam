import { BlockTopicData } from '../../types'
import blocks from '../topic7/blocks'
import { GENERATORS } from '../topic7/generators'

const topic7: BlockTopicData = {
  id: '7',
  number: '7',
  title: 'Числовые неравенства, координатная прямая',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic7
