import { BlockTopicData } from '../../types'
import blocks from '../topic16/blocks'
import { GENERATORS } from '../topic16/generators'

const topic16: BlockTopicData = {
  id: '16',
  number: '16',
  title: 'Окружность, круг и их элементы',
  format: 'blocks',
  blocks,
  generators: [...GENERATORS],
}

export default topic16
