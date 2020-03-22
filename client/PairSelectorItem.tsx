import React, { FC, useState, useCallback, FormEvent } from 'react'
import CharacterIcon from './CharacterIcon'
import { createClassName } from './Util'
import Icon from './Icon'
import { ICharacter } from './types/type'

interface IPairSelectorItemProps {
  pair: (ICharacter | undefined)[]
  idx: number
  value: number
  maxValue: number
  isSkillActive: boolean
  onValueChange: (point: number) => void
  onPairSelect: () => void
}

const PairSelectorItem: FC<IPairSelectorItemProps> = ({pair, value, maxValue, idx, isSkillActive, onValueChange, onPairSelect}) => {
  const [char1, char2] = pair
  const [pointValue, setPointValue] = useState<number>(value)
  const [isHover, setIsHover] = useState<boolean>(false)

  const handleValueChange = useCallback((e: FormEvent<HTMLInputElement>) => {
    const newValue = Number(e.currentTarget.value)
    setPointValue(newValue)
    onValueChange(newValue)
  }, [onValueChange])

  return (
    <div className={createClassName('pair-selector-item', '', isHover ? 'active' : '')}>
      <div
        className={createClassName('pair-selector-item', 'view-box')}
        onMouseEnter={(): void => setIsHover(true)}
        onMouseLeave={(): void => setIsHover(false)}
        onClick={onPairSelect}
      >
        <CharacterIcon character={char1} modifire={['sm']} isSkillActive={isSkillActive} isHover={isHover} />
        <span className={createClassName('pair-selector-item', 'cross-icon')}>
          <Icon iconName={'exchange-alt'} />
        </span>
        <CharacterIcon character={char2} modifire={['sm']} isSkillActive={isSkillActive} isHover={isHover} />
      </div>

      <div className={createClassName('pair-selector-item', 'input-box')}>
        <label className={createClassName('pair-selector-item', 'value-label')} htmlFor={`pairSelectorPoint${idx}`}>支援値</label>
        <input
          className={createClassName('pair-selector-item', 'value-input')}
          id={`pairSelectorPoint${idx}`}
          type={'number'}
          value={pointValue}
          max={maxValue}
          min={0}
          onChange={handleValueChange}
        />
      </div>
    </div>
  )
}

export default PairSelectorItem