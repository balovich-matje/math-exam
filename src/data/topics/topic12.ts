import { BlockTopicData } from '../../types'
import blocks from '../topic12/blocks'
import { GENERATORS } from '../topic12/generators'

const topic12: BlockTopicData = {
  id: '12',
  number: '12',
  title: 'Расчёты по формулам',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic12
