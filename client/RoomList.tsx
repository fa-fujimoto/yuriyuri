import React from 'react'
import { Link } from 'react-router-dom'
import { IRoom } from './types/type'

interface IRoomListProps {
  roomList: IRoom[]
}

function RoomList(props: IRoomListProps): JSX.Element {
  const {roomList} = props
  const roomItems = []

  for (let i = 0; i < roomList.length; i++) {
    const room = roomList[i]
    const {id, name, gameMaster, member} = room
    const memberItem = []
    const path = `/room/${id}`

    for (let j = 0; j < member.length; j++) {
      const playerName = member[j]
      memberItem.push(
        <li>{playerName}</li>
      )
    }

    roomItems.push(
      <li>
        <h3>{name}</h3>
        <h4>{gameMaster}</h4>
        <ul>{memberItem}</ul>
        <div><Link to={path}>checkin</Link></div>
      </li>
    )
  }

  return roomItems.length > 0 ? (
    <div className="room-list">
      <ul>
        {roomItems}
      </ul>

      <div>
        <Link to={'/room/create'}>
          Create Room
        </Link>
      </div>
    </div>
  ) : (
    <div className="room-list is-empty">
      <p>None Room</p>
      <div>
        <Link to={'/room/create'}>
          Create Room
        </Link>
      </div>
    </div>
  )
}

export default RoomList