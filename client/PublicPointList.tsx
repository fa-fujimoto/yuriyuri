import React, { FC, useMemo, useCallback } from 'react'
import { CharacterCollection, ICharacter } from './types/type'
import Table from './Table'
import MemberMarker from './MemberMarker'
import { createClassName } from './Util'
import CharacterIcon from './CharacterIcon'

interface IPublicPointListProps {
  characters: ICharacter[]
  activeCharacter?: ICharacter
  supportPoint: number
  cellLength: number
  publicPoints: CharacterCollection<number[]>
  tempPublicPoints: number[]
  onPointSelect: (point: number) => void
}

const PublicPointList: FC<IPublicPointListProps> = ({
  characters,
  activeCharacter,
  supportPoint,
  cellLength,
  publicPoints,
  tempPublicPoints,
  onPointSelect,
}) => {
  const activeCharacterIdx = useMemo<number>(() => {
    return (
      activeCharacter ? (
        characters.findIndex((character) => character.id === activeCharacter.id)
      ) : -1
    )
  }, [characters, activeCharacter])

  const iconColumn = useMemo<JSX.Element>(() => {
    return (
      <ul className={createClassName('public-point-list', 'column')}>
        {
          characters.map((character, idx) => {
            return activeCharacterIdx > -1 && activeCharacterIdx === idx ? (
              <li className={createClassName('public-point-list', 'column-item')} key={character.id}>
                <CharacterIcon character={character} isSkillActive={false} modifire={['circle', 'ss']} />
              </li>
            ) : (
              <li className={createClassName('public-point-list', 'column-item', 'disabled')} key={character.id}>
                <CharacterIcon character={character} isSkillActive={false} modifire={['circle', 'ss']} isDisabled={true} />
              </li>
            )
          })
        }
      </ul>
    )
  }, [characters, activeCharacterIdx])

  const tableHeaderLable = useMemo<number[]>(() => {
    return Array.from(Array(cellLength), (v, k) => k + 1)
  }, [cellLength])

  const tableData = useMemo<(JSX.Element | null)[][]>(() => {
    return characters.map((character, idx) => {
      const result = []
      const publicPoint = publicPoints[character.id]

      for (let i = 0; i < cellLength; i++) {
        const memberIdx = publicPoint.findIndex(point => point === i + 1)
        const tempMemberIdx = activeCharacterIdx === idx ? tempPublicPoints.findIndex(point => point === i + 1) : -1

        if (memberIdx > -1) {
          result.push(
            <MemberMarker idx={memberIdx} />
          )
        } else if (tempMemberIdx > -1) {
          result.push(
            <MemberMarker idx={tempMemberIdx} modifire={['temp']} />
          )
        } else {
          result.push(null)
        }
      }

      return result
    })
  }, [cellLength, publicPoints, tempPublicPoints])
  const clickableCellIdx = useMemo<number[][]>(() => {
    return characters.map((character, idx) => {
      if (activeCharacterIdx === idx) {
        const publicPoint = publicPoints[character.id]
        const maxPublicPoint = Math.max(...publicPoint)
        const clickableLength = supportPoint - maxPublicPoint

        return Array.from(Array(clickableLength), (v, k) => k + maxPublicPoint)
      } else {
        return []
      }
    })
  }, [supportPoint, activeCharacterIdx, publicPoints])

  const handleCellClick = useCallback((rowIdx, cellIdx): void => {
    if (tableData[rowIdx][cellIdx] === null) {
      onPointSelect(cellIdx + 1)
    }
  }, [tableData, onPointSelect])

  const labelAreaElem = useMemo<JSX.Element>(() => {
    return (
      <div className={createClassName('public-point-list', 'label-area')}>
        <div className={createClassName('public-point-list', 'column-label')}></div>
        {iconColumn}
      </div>
    )
  }, [iconColumn])

  const selectAreaElem = useMemo<JSX.Element>(() => {
    return (
      <div className={createClassName('public-point-list', 'select-area')}>
        <Table
          baseClassName={'public-point-list'}
          rowData={tableData}
          headerLabel={tableHeaderLable}
          clickableCellIdx={clickableCellIdx}
          onClick={activeCharacterIdx > -1 ? handleCellClick : undefined}
        />
      </div>
    )
  }, [tableData, tableHeaderLable, clickableCellIdx, activeCharacterIdx, handleCellClick])

  return (
    <div className={'public-point-list'}>
      <div className={createClassName('public-point-list', 'content')}>
        {labelAreaElem}
        {selectAreaElem}
      </div>
    </div>
  )
}

export default PublicPointList