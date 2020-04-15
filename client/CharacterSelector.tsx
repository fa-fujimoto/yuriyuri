import React, { FC, useMemo, useCallback, useState, useEffect } from 'react'
import CharacterIcon from './CharacterIcon'
import { createClassName } from './Util'
import { ICharacter, CharacterId, IRelation } from './types/type'
import CharacterViewer from './CharacterViewer'
import Dialog from './Dialog'

interface ICharacterSelectorProps {
  characters: ICharacter[]
  targetIdx: number
  relation: IRelation[]
  max: number
  min?: number
  excludeIdList?: CharacterId[]
  otherSelectedIdSet?: CharacterId[][]
  selectedCharacters: ICharacter[]
  isSkillActive: boolean
  onSelect: (targetIdx: number, ...characters: ICharacter[]) => void
}

const CharacterSelector: FC<ICharacterSelectorProps> = ({
  characters,
  targetIdx,
  relation,
  max,
  min,
  excludeIdList = [],
  otherSelectedIdSet = [],
  selectedCharacters,
  isSkillActive,
  onSelect,
}) => {
  const size = useMemo(() => 'md', [])
  const [selected, setSelected] = useState<ICharacter[]>(selectedCharacters)
  const [focused, setFocused] = useState<ICharacter>(characters[0])

  const handleSelect = useCallback((selected: ICharacter[], selectCharacter: ICharacter | undefined) => {
    if (selectCharacter) {
      const newSelected = selected.slice()
      const targetIdx = newSelected.findIndex(character => character.id === selectCharacter.id)
      if (targetIdx >= 0) {
        newSelected.splice(targetIdx, 1)
      } else {
        newSelected.push(selectCharacter)
      }

      setSelected(newSelected)
    }
  }, [])

  const renderItemElement = useCallback((selected: ICharacter[]): JSX.Element[] => {
    return characters.map(character => {
      let iconElement: JSX.Element | undefined

      if (selected.includes(character)) {
        iconElement = (
          <CharacterIcon
            character={character}
            isSkillActive={isSkillActive}
            modifire={[size, 'selecting']}
            onClick={(character): void => handleSelect(selected, character)}
          />
        )
      } else if (excludeIdList.includes(character.id)) {
        iconElement = (
          <CharacterIcon
            character={character}
            isSkillActive={isSkillActive}
            modifire={[size, 'selected']}
            isDisabled={true}
          />
        )
      } else if (selected.length === max) {
        iconElement = (
          <CharacterIcon
            character={character}
            isSkillActive={isSkillActive}
            modifire={[size]}
            isDisabled={true}
          />
        )
      } else {
        iconElement = (
          <CharacterIcon
            character={character}
            isSkillActive={isSkillActive}
            modifire={[size]}
            onClick={(character): void => handleSelect(selected, character)}
          />
        )
      }

      return (
        <li
          key={character.id}
          className={createClassName('character-selector', 'item')}
          onMouseEnter={(): void => setFocused(character)}
        >
          {iconElement}
        </li>
      )
    })
  }, [characters, max, excludeIdList])

  useEffect(() => {
    setSelected(selectedCharacters)
  }, [targetIdx])

  const isValidate = useCallback((): boolean => {
    const isSelectedStipukatedNum = min ? max >= selected.length || selected.length >= min : max === selected.length
    if (isSelectedStipukatedNum && otherSelectedIdSet.length > 0) {
      return otherSelectedIdSet.every((idSet) => {
        let result = true

        if (idSet.length > 0) {
          result = false

          for (const selectedCharacter of selected) {
            if (!result) {
              result = !idSet.includes(selectedCharacter.id)
            }
          }
        }

        return result
      })
    } else {
      return isSelectedStipukatedNum
    }
  }, [min, max, otherSelectedIdSet, selectedCharacters, selected])

  return (
    <Dialog
      title={'支援するペアを選択してください'}
      positiveTxt={'確定'}
      onPositiveFunc={isValidate() ? (): void => onSelect(targetIdx, ...selected) : undefined}
      dangerTxt={'クリア'}
      onDangerFunc={(): void => onSelect(targetIdx)}
    >
      <div className={createClassName('character-selector')}>
        <div className={createClassName('character-selector', 'select-area')}>
          <ul className={createClassName('character-selector', 'list')}>
            {renderItemElement(selected)}
          </ul>
        </div>

        <div className={createClassName('character-selector', 'viewer', focused ? focused.id : '')}>
          {
            focused ? (
              <CharacterViewer character={focused} characters={characters} relation={relation} isSkillActive={isSkillActive} />
            ) : (
              null
            )
          }
        </div>
      </div>
    </Dialog>
  )
}

export default CharacterSelector