import { BlockTopicData } from '../../types'
import blocks from '../topic10/blocks'
import { GENERATORS } from '../topic10/generators'

const topic10: BlockTopicData = {
  id: '10',
  number: '10',
  title: 'Теория вероятностей',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic10
