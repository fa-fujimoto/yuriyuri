import React, { FC, useMemo } from 'react'
import { createClassName } from './Util'

interface IMemberMarkerProps {
  idx: number
  modifire?: string[]
}

const MemberMarker: FC<IMemberMarkerProps> = ({
  idx,
  modifire = [],
}) => {
  const memberDisplayName = useMemo<string[]>(() => ['A', 'B', 'C', 'D', 'E', 'F'], [])
  const displayName = useMemo<string>(() => memberDisplayName[idx], [idx])

  return (
    <span className={createClassName('member-marker', '', [displayName.toLowerCase(), ...modifire])}>
      {displayName}
    </span>
  )
}

export default MemberMarker