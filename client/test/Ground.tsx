import React, { FC } from 'react'

// interface IGroundProps {
// }

const Ground: FC<{}> = ({children}) => {
  return (
    <div className={'test-ground'}>
      {children}
    </div>
  )
}

export default Ground