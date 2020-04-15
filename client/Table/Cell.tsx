import React, { FC, useMemo, useState } from "react"
import { createClassName } from "../Util"

interface ICellProps {
  baseClassName: string
  modifire?: string[]
  cellIdx: number
  onClick?: (cellNum: number) => void
}

const Cell: FC<ICellProps> = ({baseClassName, cellIdx, modifire = [], onClick, children}) => {
  const isClickable = useMemo(() => onClick !== undefined, [onClick])
  const [isHover, setIsHover] = useState<boolean>(false)

  return (
    <li
      className={createClassName(baseClassName, 'cell', [isClickable ? 'clickable' : '', isHover ? 'active' : '', ...modifire])}
      onClick={onClick !== undefined ? (): void => onClick(cellIdx) : (): void => void(0)}
      onMouseEnter={isClickable ? (): void =>setIsHover(true) : (): void => void(0)}
      onMouseLeave={isClickable ? (): void =>setIsHover(false) : (): void => void(0)}
    >
      {children}
    </li>
  )
}

export default Cell