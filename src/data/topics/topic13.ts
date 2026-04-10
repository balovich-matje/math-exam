import { BlockTopicData } from '../../types'
import blocks from '../topic13/blocks'
import { GENERATORS } from '../topic13/generators'

const topic13: BlockTopicData = {
  id: '13',
  number: '13',
  title: 'Неравенства',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic13
