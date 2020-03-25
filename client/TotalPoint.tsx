import React, { FC } from 'react'
import { createClassName } from './Util'

interface ITotalPointProps {
  maxTotalPoint: number
  currentTotalPoint: number
}

const TotalPoint: FC<ITotalPointProps> = ({maxTotalPoint, currentTotalPoint}) => {
  return (
    <dl className={createClassName('total-point')}>
      <dt className={createClassName('total-point', 'label')}>合計点</dt>
      <dd className={createClassName('total-point', 'value', maxTotalPoint === currentTotalPoint ? 'success' : 'invalid')}>
        {`${currentTotalPoint}/${maxTotalPoint}`}
      </dd>
    </dl>
  )
}

export default TotalPoint