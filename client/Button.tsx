import React, { FC, useState, useMemo } from 'react'
import { createClassName } from './Util'

interface IButton {
  modifire: string | string[]
  isDisabled?: boolean
  onClick?: () => void
}

const Button: FC<IButton> = ({modifire, isDisabled, onClick, children}) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const classNameList = useMemo<string[]>(() => [createClassName('button', '', modifire)], [modifire, isActive, isDisabled])
  const handleClick = useMemo(() => isDisabled ? (): void => undefined : onClick, [isDisabled, onClick])
  if (isDisabled) {
    classNameList.push('disabled')
  }
  if (isActive) {
    classNameList.push('active')
  }

  return (
    <div className={classNameList.join(' ')}
      onClick={handleClick}
      onMouseEnter={(): void => isDisabled ? setIsActive(false) : setIsActive(true)}
      onMouseLeave={(): void => isDisabled ? setIsActive(false) : setIsActive(false)}
    >
      <div className={createClassName('button', 'inner')}>
        {children}
      </div>
    </div>
  )
}

export default Button