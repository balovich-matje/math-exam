import { TopicData, BlockTopicData } from '../types'

export type AnyTopic = TopicData | BlockTopicData
export function isBlockTopic(t: AnyTopic): t is BlockTopicData {
  return 'format' in t && t.format === 'blocks'
}
import topic1_5 from './topics/topic1_5'
import topic6 from './topics/topic6'
import topic7 from './topics/topic7'
import topic8 from './topics/topic8'
import topic9 from './topics/topic9'
import topic10 from './topics/topic10'
import topic11 from './topics/topic11'
import topic12 from './topics/topic12'
import topic13 from './topics/topic13'
import topic14 from './topics/topic14'
import topic15 from './topics/topic15'
import topic16 from './topics/topic16'
import topic17 from './topics/topic17'
import topic18 from './topics/topic18'
import topic19 from './topics/topic19'
import topic20 from './topics/topic20'
import topic21 from './topics/topic21'
import topic23 from './topics/topic23'

export const allTopics: AnyTopic[] = [
  topic1_5,
  topic6,
  topic7,
  topic8,
  topic9,
  topic10,
  topic11,
  topic12,
  topic13,
  topic14,
  topic15,
  topic16,
  topic17,
  topic18,
  topic19,
  topic20,
  topic21,
  topic23,
]

export function getTopicById(id: string): AnyTopic | undefined {
  return allTopics.find((t) => t.id === id)
}
