import React, { FC, CSSProperties } from 'react'
import { ICharacter, CharacterId } from './types/type'

interface IActionTargetItemProps {
  character: ICharacter
  type: 'selected' | 'selectable' | 'notSelectable'
  positivePoint?: number
  negativePoint?: number
  onClick?: (characterId: CharacterId) => void
}

const ActionTargetItem: FC<IActionTargetItemProps> = ({character, positivePoint = 0, negativePoint = 0, type, onClick}) => {
  const baseStyle: CSSProperties = {
    display: 'inline-block',
    padding: '5px',
  }
  let style: CSSProperties = {}

  switch (type) {
  case 'selected':
    style.backgroundColor = '#00f'
    break
  case 'notSelectable':
    style.backgroundColor = '#aaa'
    break
  default:
    break
  }

  style = Object.assign(baseStyle, style)

  return (
    <li onClick={onClick ? (): void => onClick(character.id) : (): boolean => false} style={style}>
      <img src={character.iconSrc} alt="" width={100} height={100} />
      <p>
        <span style={{display: 'inline-block', width: '50%', textAlign: 'center', backgroundColor: '#f00'}}>
          {positivePoint}
        </span>
        <span style={{display: 'inline-block', width: '50%', textAlign: 'center', backgroundColor: '#00f'}}>
          {negativePoint}
        </span>
      </p>
    </li>
  )
}

export default ActionTargetItem
