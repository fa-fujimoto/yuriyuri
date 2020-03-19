import { IconName } from "@fortawesome/fontawesome-svg-core"

type SkillNames = 'aggressive' | 'attracting' | 'cool' | 'passive' | 'shy' | 'friendly' | 'cute' | 'attracted'

interface ISkill {
  id: SkillNames
  name: string
  japanese: string
  overview: string
  description: string
  iconName: IconName
}

type CharacterId = 'black' | 'gray' | 'green' | 'pink' | 'purple' | 'red' | 'sky' | 'white' | 'yellow'
interface IDefaultCharacter {
  id: CharacterId
  lastName: string
  firstName: string
  birthday: Date
  birthplace: string
  words: string[]
  skills: [SkillNames, SkillNames]
  iconType: number
}
interface ICharacter extends IDefaultCharacter {
  iconSrc: string
}

interface IDefaultRoomSetting {
  name: string
}

interface IRoom extends IDefaultRoomSetting {
  id: string
  gameMaster: string
  member: string[]
  characters: ICharacter[]
}

interface ISkillSelectorInfo {
  characterId: CharacterId
  skillNumber: number
  currentSelectSkill: SkillNames
  selectedSkill: SkillNames
}

type CharacterCollection<T> = {
  [P in CharacterId]: T
}

interface ICharacterIcons {
  [key: number]: {
    [P in CharacterId]: string
  }
}

interface IRelation {
  pairId: [CharacterId, CharacterId]
  positivePoint: number
  negativePoint: number
  kissCount: number
  isRelationship: boolean
  isFirst?: boolean
}

interface IRelationUpdatedParam {
  pairId: [CharacterId, CharacterId]
  positivePoint?: number
  negativePoint?: number
  kissCount?: number
  isRelationship?: boolean
  isFirst?: boolean
}

interface IReaction {
  type: 'confess' | 'loveGame' | 'loveGameConfirmation'
  characters: ICharacter[]
  result: boolean[]
  target: ICharacter[]
}

type phase = 'initialize' | 'supportedPairSelect' | 'action' | 'couple' | 'theKiss' | 'supportPairAdd'
interface IPhaseCollection {
  INITIALIZE: phase
  SUPPORTED_PAIR_SELECT: phase
  ACTION: phase
  COUPLE: phase
  THE_KISS: phase
  supportPairAdd: phase
}
