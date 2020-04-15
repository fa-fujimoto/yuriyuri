import React, { FC, useMemo } from 'react'
import { createClassName } from '../Util'

interface ITheadProps {
  baseClassName: string
  cellData: (string | number | JSX.Element | null)[]
  modifire?: string[]
}

const Thead: FC<ITheadProps> = ({
  baseClassName,
  cellData,
  modifire = [],
}) => {
  const cellElement = useMemo<JSX.Element[]>(() => {
    return cellData.map((data, i) => {
      return (
        <li
          key={`theadCell${i}`}
          className={createClassName(baseClassName, 'cell')}
        >
          {data}
        </li>
      )
    })
  }, [cellData])

  return (
    <div className={createClassName(baseClassName, 'thead', ...modifire)}>
      <ul className={createClassName(baseClassName, 'row')}>
        {cellElement}
      </ul>
    </div>
  )
}

export default Thead