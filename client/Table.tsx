import React, { FC, useMemo } from 'react'
import { createClassName } from './Util'
import Row from './Table/Row'
import Thead from './Table/Thead'

interface ITableProps {
  baseClassName?: string
  rowData: (string | number | JSX.Element | null)[][]
  headerLabel?: (string | number)[]
  modifire?: string[]
  clickableCellIdx?: number[][]
  onClick?: (rowIdx: number, cellIdx: number) => void
}

const Table: FC<ITableProps> = ({
  baseClassName = 'table',
  rowData,
  headerLabel,
  modifire = [],
  clickableCellIdx = [],
  onClick,
}) => {
  const isSelectable = onClick !== undefined
  const rowElement = useMemo<JSX.Element[]>(() => {
    return rowData.map((cellData, i) => {
      const isClickable = isSelectable && clickableCellIdx[i].length > 0
      return (
        <Row
          key={`tableRow${i}`}
          baseClassName={baseClassName}
          cellData={cellData}
          rowIdx={i}
          modifire={[isClickable ? 'clickable' : '']}
          clickableCellIdx={clickableCellIdx[i]}
          onClick={isClickable && onClick !== undefined ? onClick : undefined}
        />
      )
    })
  }, [rowData, clickableCellIdx, onClick])

  return (
    <div className={createClassName(baseClassName, 'table', [isSelectable ? 'clickable' : '', ...modifire])}>
      {
        headerLabel ? (
          <Thead
            baseClassName={baseClassName}
            cellData={headerLabel}
          />
        ) : null
      }
      <div className={createClassName(baseClassName, 'tbody')}>
        {rowElement}
      </div>
    </div>
  )
}

export default Table