import React, { FC, useState, useMemo } from 'react'
import { ICharacter } from './types/type'
import { createClassName, createFullName } from './Util'
import { IconName } from '@fortawesome/free-solid-svg-icons'
import Icon from './Icon'

interface ICharacterIconProps {
  character?: ICharacter
  modifire?: string[]
  isSkillActive: boolean
  isHover?: boolean
  isDisabled?: boolean
  isShowName?: boolean
  label?: string
  onClick?: (character?: ICharacter) => void
}

const CharacterIcon: FC<ICharacterIconProps> = ({
  character,
  modifire = [],
  isHover,
  isDisabled = false,
  isShowName = false,
  onClick,
}) => {
  const [isDefaultHover, setIsDefaultHover] = useState<boolean>(false)
  const characterId = useMemo<string>(() => character ? character.id : 'empty', [character])
  const isClickable = useMemo<boolean>(() => {
    return !isDisabled && (isHover === undefined && onClick !== undefined)
  }, [onClick, isHover, isDisabled])
  const wrapperClassName = useMemo<string>(() => {
    return isHover || (onClick !== undefined && isDefaultHover) ? (
      createClassName('character-icon', '', [characterId, ...modifire, 'active'])
    ) : (
      createClassName('character-icon', '', [characterId, ...modifire, isDisabled ? 'disabled' : ''])
    )
  }, [isHover, isDefaultHover, isDisabled, modifire, character, onClick])

  let iconName: IconName | undefined

  if (modifire.includes('selected')) {
    iconName = 'ban'
  } else if (modifire.includes('selecting')) {
    iconName = 'check'
  }

  return (
    <div
      className={wrapperClassName}
      onMouseEnter={isClickable ? (): void => setIsDefaultHover(true) : (): void => undefined}
      onMouseLeave={isClickable ? (): void => setIsDefaultHover(false) : (): void => undefined}
      onClick={isClickable && onClick ? (): void => onClick(character) : (): void => undefined}
    >
      <div
        className={createClassName('character-icon', 'inner')}
      >
        {
          character ? (
            <>
              <img
                className={createClassName('character-icon', 'img')}
                src={character.iconSrc}
                alt={createFullName(character)}
              />

              {
                isShowName ? (
                  <>
                    <p className={createClassName('character-icon', 'last-name')}>
                      {character.lastName}
                    </p>
                    <p className={createClassName('character-icon', 'first-name')}>
                      {character.firstName}
                    </p>
                  </>
                ) : null
              }
            </>
          ) : (
            <div className={createClassName('character-icon', 'empty-box')}>
              {'Empty'}
            </div>
          )
        }
        <p className={createClassName('character-icon', 'label')}>
          {
            iconName ? (
              <Icon iconName={iconName} />
            ) : null
          }
        </p>
      </div>
    </div>
  )
}

export default CharacterIcon