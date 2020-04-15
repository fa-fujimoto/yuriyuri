import React, { FC, useMemo, useCallback, useState } from 'react'
import { createClassName } from './Util'
import CharacterIcon from './CharacterIcon'
import RelationLine from './RelationLine'
import { IRelation, ICharacter, CharacterId, CharacterCollection } from './types/type'

interface IRelationProps {
  relation: IRelation[]
  characters: ICharacter[]
  isSkillActive: boolean
  onClick?: (character: ICharacter) => void
}

const Relation: FC<IRelationProps> = ({relation, characters, isSkillActive, onClick}) => {
  const boxSize = useMemo<number>(() => 600, [])
  const imgSize = useMemo<{width: number, height: number}>(() => {return {width: 150, height: 150}}, [])
  const [hoverCharacterId, setHoverCharacterId] = useState<CharacterId>()

  const calcPosition = (): CharacterCollection<[number, number]> => {
    const iconPos: CharacterCollection<[number, number]> = {
      'black': [0, 0],
      'gray': [0, 0],
      'green': [0, 0],
      'pink': [0, 0],
      'purple': [0, 0],
      'red': [0, 0],
      'sky': [0, 0],
      'white': [0, 0],
      'yellow': [0, 0],
    }

    //itemの親要素の半径を計算
    const r = boxSize / 2

    //item要素数から角度を計算
    const angle = 360 / characters.length

    //指定
    for (let i = 0; i < characters.length; i++) {
      const character = characters[i]
      const deg = angle * i - 45

      //x,y座標の取得
      const x = Math.round(Math.cos(deg * Math.PI / 180) * r + r)
      const y = Math.round(Math.sin(deg * Math.PI / 180) * r + r)
      iconPos[character.id] = [x, y]
    }

    return iconPos
  }

  const calcLineBasePos = (iconPos: CharacterCollection<[number, number]>): CharacterCollection<[number, number][]> => {
    const lineBasePos: CharacterCollection<[number, number][]> = {
      'black': [],
      'gray': [],
      'green': [],
      'pink': [],
      'purple': [],
      'red': [],
      'sky': [],
      'white': [],
      'yellow': [],
    }

    //item要素の幅,高さの2分の1を取得
    const l = imgSize.width / 2
    const h = imgSize.height / 2

    for (const character of characters) {
      const [x, y] = iconPos[character.id]

      const top: [number, number] = [x + l, y]
      const right: [number, number] = [x + l * 2, y + h]
      const bottom: [number, number] = [x + l, y + h * 2]
      const left: [number, number] = [x, y + h]

      lineBasePos[character.id].push(top, right, bottom, left)
    }

    return lineBasePos
  }

  const renderIcon = useCallback(
    (
      iconPos: CharacterCollection<[number, number]>,
      hoverCharacterId: CharacterId | undefined
    ): JSX.Element[] => {
      return characters.map((character) => {
        const isHover = hoverCharacterId === character.id
        const boxStyle: React.CSSProperties = {
          left: iconPos[character.id][0],
          top: iconPos[character.id][1],
          width: imgSize.width,
          height: imgSize.height,
        }

        return (
          <li key={'relationCharacter' + character.id} style={boxStyle} className={createClassName('relation', 'character', isHover ? 'active' : '')} >
            <CharacterIcon modifire={['lg']} character={character} isSkillActive={isSkillActive} isHover={isHover} />
          </li>
        )
      })
    }, [imgSize, isSkillActive, characters])

  const renderIconClickArea = useCallback((iconPos: CharacterCollection<[number, number]>) => {
    return characters.map(character => {
      const boxStyle: React.CSSProperties = {
        left: iconPos[character.id][0],
        top: iconPos[character.id][1],
        width: imgSize.width,
        height: imgSize.height,
      }

      return (
        <li
          key={'relationCharacterClickArea' + character.id}
          style={boxStyle}
          className={createClassName('relation', 'character')}
          onClick={onClick ? (): void => onClick(character) : (): void => undefined}
          onMouseEnter={(): void => setHoverCharacterId(character.id)}
          onMouseLeave={(): void => setHoverCharacterId(undefined)}
        />
      )
    })
  }, [imgSize, characters, onClick])

  const iconPos = useMemo<CharacterCollection<[number, number]>>(() => calcPosition(), [characters, imgSize])
  const lineBasePos = useMemo<CharacterCollection<[number, number][]>>(() => calcLineBasePos(iconPos), [iconPos])

  return (
    <div
      className='relation'
      style={{
        width: boxSize + imgSize.width,
        height: boxSize + imgSize.height,
      }}
    >
      <ul
        className={createClassName('relation', 'diagram')}
        style={{
          width: boxSize,
          height: boxSize,
          padding: `${imgSize.height / 2}px ${imgSize.width / 2}px`,
        }}
      >
        {renderIcon(iconPos, hoverCharacterId)}
        <li className={createClassName('relation', 'line')}>
          <RelationLine size={boxSize + imgSize.width} relation={relation} lineBasePos={lineBasePos} activeCharacterId={hoverCharacterId} />
        </li>
      </ul>


      <ul
        className={createClassName('relation', 'diagram', 'click-area')}
        style={{
          width: boxSize,
          height: boxSize,
          padding: `${imgSize.height / 2}px ${imgSize.width / 2}px`,
        }}
      >
        {renderIconClickArea(iconPos)}
      </ul>
    </div>
  )
}

export default Relation