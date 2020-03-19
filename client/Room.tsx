import React, { FC, useMemo } from 'react'
import { RouteComponentProps, Redirect } from 'react-router-dom'
import RoomItem from './RoomItem'
import { IRoom } from './types/type'

interface IRoomProps extends RouteComponentProps<{id: string}> {
  roomList: IRoom[]
  player: string
}

const Room: FC<IRoomProps> = ({roomList, player, match}) => {
  const room = useMemo(() => roomList.find((roomItem): boolean => roomItem.id === match.params.id), [match, roomList])

  return (
    room !== undefined ? (
      <RoomItem player={player} room={room} />
    ) : (
      <Redirect to='/room' />
    )
  )
}

export default Room