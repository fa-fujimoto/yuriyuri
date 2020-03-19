import React, { FC, useState, useCallback } from 'react'
import {Route, Switch} from 'react-router-dom'
import Room from './Room'
import RoomList from './RoomList'
import RoomCreate from './RoomCreate'

import DefaultCharacters from './data/DefaultCharacters'
import SkillList from './data/SkillList'
import { IRoom, IDefaultCharacter, IDefaultRoomSetting, SkillNames, ICharacter } from './types/type'

interface IRoomRouterProps {
  username: string
}

const RoomRouter: FC<IRoomRouterProps> = ({username}) => {
  const [roomList, setRoomList] = useState<IRoom[]>([])
  const defaultCharacters: IDefaultCharacter[] = DefaultCharacters
  const skillList = SkillList
  const defaultRoomSetting: IDefaultRoomSetting = {name: 'Room'}
  const skillNameList: SkillNames[] = ['aggressive', 'attracting', 'cool', 'passive', 'shy', 'friendly', 'cute', 'attracted']

  const handleRoomCreate = useCallback((roomSetting: IDefaultRoomSetting, characterList: ICharacter[]): void => {
    const newRoom: IRoom = Object.assign({
      id: '1',
      gameMaster: username,
      member: [],
      characters: characterList,
    }, roomSetting)

    const updatedRoomList = roomList.slice()
    updatedRoomList.push(newRoom)
    setRoomList(updatedRoomList)
  }, [roomList])

  return (
    <Switch>
      <Route path='/' exact render={(): JSX.Element => <RoomList roomList={roomList} />} />
      <Route path='/room' exact render={(): JSX.Element => <RoomList roomList={roomList} />} />
      <Route path='/room/create' render={(): JSX.Element => <RoomCreate defaultRoomSetting={defaultRoomSetting} defaultCharacters={defaultCharacters} skillNameList={skillNameList} skillList={skillList} handleRoomCreate={handleRoomCreate} />} />
      <Route path='/room/:id' render={(props): JSX.Element => <Room player={username} history={props.history} location={props.location} match={props.match} roomList={roomList} />} />
    </Switch>
  )
}

export default RoomRouter