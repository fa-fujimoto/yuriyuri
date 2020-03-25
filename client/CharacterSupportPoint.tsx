import React, { FC } from 'react'
import { ICharacter, CharacterCollection } from './types/type'
import { createClassName } from './Util'
import CharacterIcon from './CharacterIcon'

interface ICharacterSupportPointProps {
  characters: ICharacter[]
  characterSupportPoint: CharacterCollection<number>
  nextCharacterSupportPoint: CharacterCollection<number>
  onIconClick: (character?: ICharacter) => void
}

const CharacterSupportPoint: FC<ICharacterSupportPointProps> = ({
  characters,
  characterSupportPoint,
  nextCharacterSupportPoint,
  onIconClick,
}) => {
  const sortedCharacters = characters.slice().sort((character1, character2) => {
    const point1 = nextCharacterSupportPoint[character1.id]
    const point2 = nextCharacterSupportPoint[character2.id]

    return point2 - point1
  })
  const listItem: (JSX.Element | null)[] = characters.map(character => {
    const sortOrder = sortedCharacters.findIndex(sortedCharacter => sortedCharacter.id === character.id)
    const nextSupportPoint = nextCharacterSupportPoint[character.id]
    const supportPoint = characterSupportPoint[character.id]
    const pointDiff = nextSupportPoint - supportPoint
    let modifireName = ''

    if (pointDiff > 0) {
      modifireName = 'plus'
    } else if (0 > pointDiff) {
      modifireName = 'minus'
    }

    return (
      <li className={createClassName('character-support-point', 'item', character.id)} style={{order: sortOrder}}>
        <div className={createClassName('character-support-point', 'icon-area')}>
          <CharacterIcon character={character} modifire={['ss']} isSkillActive={false} onClick={onIconClick} />
        </div>

        <div className={createClassName('character-support-point', 'point-area', [modifireName, character.id])}>
          {nextSupportPoint}
        </div>
      </li>
    )
  })

  return (
    listItem.some(item => item !== null) ? (
      <div className={createClassName('character-support-point')}>
        <ul className={createClassName('character-support-point', 'list')}>
          {listItem}
        </ul>
      </div>
    ) : null
  )
}

export default CharacterSupportPoint