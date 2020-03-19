import React, { useState, FC, useCallback } from 'react'
import {createClassName} from './Util'
import { ICharacter } from './types/type'

interface IDicerollProps {
  isShow: boolean
  sender: ICharacter
  receiver: ICharacter
  onRollComplete: (value: number) => void
}

const Diceroll: FC<IDicerollProps> = ({isShow, sender, receiver, onRollComplete}) => {
  const [isRolling, setIsRolling] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState(Math.floor(Math.random() * 6 + 1))

  const handleClick = useCallback(() => {
    if (!isRolling && !isCompleted) {
      setIsRolling(true)

      setTimeout(() => {
        setIsRolling(false)
        setIsCompleted(true)
        setResult(Math.floor(Math.random() * 6 + 1))
      }, 1000)
    }
  }, [isRolling, isCompleted])

  const handleRollComplete = useCallback(() => {
    onRollComplete(result)
    setIsCompleted(false)
  }, [onRollComplete, result, sender, receiver])

  return (
    isShow ? (
      <div className={createClassName('diceroll')}>
        <h3 className={createClassName('diceroll', 'title')}>ダイスロールしてください。</h3>
        <p className={createClassName('diceroll', 'text')}>クリックでダイスロール</p>
        <div className={createClassName('diceroll', 'roll-area', isRolling ? 'rolling' : '')} onClick={handleClick}>
          <div className={createClassName('diceroll', 'dice', isRolling ? 'rolling' : `value${result}`)}></div>
        </div>
        {
          isCompleted ? (
            <div className={createClassName('btn', '')} onClick={handleRollComplete}>
              `${result}が出ました`
            </div>
          ) : (
            <div className={createClassName('btn', '', 'disabled')}>ok</div>
          )
        }
      </div>
    ) : null
  )
}

export default Diceroll