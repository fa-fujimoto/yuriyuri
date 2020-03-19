import React, { FC } from 'react'
import {CSSTransition} from 'react-transition-group'

interface ICutInProps {
  isShow: boolean
  modifire: string
  onEntered: () => void
  onExited: () => void
}

const CutIn: FC<ICutInProps> = ({isShow, modifire, children, onEntered, onExited}) => {
  const duration = 500

  return (
    <CSSTransition in={isShow} timeout={duration} mountOnEnter unmountOnExit classNames={'cutin-'} onEntered={onEntered} onExited={onExited}>
      <div className={`cutin cutin--${modifire}`}>
        <p className='cutin__text'>
          {children}
        </p>
      </div>
    </CSSTransition>
  )
}

export default CutIn