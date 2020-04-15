import React, { FC, useMemo } from 'react'
import { createClassName } from '../Util'
import Cell from './Cell'

interface IRowProps {
  baseClassName: string
  cellData: (string | number | JSX.Element | null)[]
  rowIdx: number
  modifire?: string[]
  clickableCellIdx?: number[]
  onClick?: (rowIdx: number, cellIdx: number) => void
}

const Row: FC<IRowProps> = ({
  baseClassName,
  cellData,
  rowIdx,
  modifire = [],
  clickableCellIdx = [],
  onClick,
}) => {
  const isClickable = useMemo<boolean>(() => {
    return clickableCellIdx.length > 0
  }, [clickableCellIdx, onClick])
  const cellElement = useMemo<JSX.Element[]>(() => {
    return cellData.map((data, i) => {
      return (
        <Cell
          key={`tableCell${i}`}
          baseClassName={baseClassName}
          cellIdx={i}
          onClick={
            isClickable &&
            clickableCellIdx.includes(i) &&
            onClick !== undefined ? (
                cellIdx => onClick(rowIdx, cellIdx)
              ) : undefined
          }
        >
          {data}
        </Cell>
      )
    })
  }, [clickableCellIdx, cellData, isClickable, onClick])

  return (
    <ul className={createClassName(baseClassName, 'row', [isClickable ? 'clickable' : '', ...modifire])}>
      {cellElement}
    </ul>
  )
}

export default Row