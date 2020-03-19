import React, { FC } from 'react'
import { ICharacter } from './types/type'

interface ITurnViewProps {
  turnCount: number
  turnOrder: ICharacter[]
  activeCharacterIdx: number
}

const TurnView: FC<ITurnViewProps> = ({turnCount, turnOrder, activeCharacterIdx}) => {
  const waitingCharacters: ICharacter[] = turnOrder.slice(activeCharacterIdx, turnOrder.length)
  const waitingElem: JSX.Element[] = []

  for (let i = 0; i < waitingCharacters.length; i++) {
    const character = waitingCharacters[i]
    const activeCharacter: React.CSSProperties = i === 0 ? {borderColor: '#ffa3a3'} : {}
    waitingElem.push(
      <li style={{display: 'inline-block', marginRight: '5px'}}>
        <div style={Object.assign({ borderRadius: '50%', overflow: 'hidden', lineHeight: '1', border: '3px solid #aaa'}, activeCharacter)}>
          <img src={character.iconSrc} width="50" style={{verticalAlign: 'middle'}} />
        </div>
      </li>
    )
  }

  return (
    <div style={{padding: '5px', backgroundColor: '#efefef', borderBottom: '1px solid #aaa', position: 'absolute', top: '0', right: '0', left: '0'}}>
      <h4>Turn {turnCount}</h4>
      <ul>
        {waitingElem}
      </ul>
    </div>
  )
}

export default TurnView