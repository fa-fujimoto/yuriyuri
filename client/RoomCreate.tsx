import React, { Component, FormEvent } from 'react'
import CharacterList from './CharacterList'
import CharacterIcons from './data/CharacterIcons'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { IDefaultRoomSetting, IDefaultCharacter, SkillNames, ISkill, ICharacterIcons, ICharacter } from './types/type'

interface IRoomCreateProps extends RouteComponentProps {
  defaultRoomSetting: IDefaultRoomSetting
  defaultCharacters: IDefaultCharacter[]
  skillNameList: SkillNames[]
  skillList: ISkill[]
  handleRoomCreate: (setting: IDefaultRoomSetting, characterList: ICharacter[]) => void
}

interface IRoomCreateState {
  roomSetting: IDefaultRoomSetting
  characters: IDefaultCharacter[]
  characterIcons: ICharacterIcons
}

class RoomCreate extends Component<IRoomCreateProps, IRoomCreateState> {
  constructor(props: IRoomCreateProps) {
    super(props)

    this.state = {
      roomSetting: props.defaultRoomSetting,
      characters: props.defaultCharacters,
      characterIcons: CharacterIcons,
    }

    this.handleRoomNameChange = this.handleRoomNameChange.bind(this)
    this.handleCharacterChange = this.handleCharacterChange.bind(this)
    this.handleCreateBtnClick = this.handleCreateBtnClick.bind(this)
  }

  handleRoomNameChange(event: FormEvent<HTMLInputElement>): void {
    const value = event.currentTarget.value
    const newRoomSetting = Object.assign({}, this.state.roomSetting)
    newRoomSetting.name = value

    this.setState({
      roomSetting: newRoomSetting,
    })
  }

  handleCharacterChange(characters: IDefaultCharacter[]): void {
    this.setState({
      characters,
    })
  }

  handleCreateBtnClick(setting: IDefaultRoomSetting, characterList: IDefaultCharacter[]): void {
    const {handleRoomCreate, history} = this.props
    const {characterIcons} = this.state

    const characters: ICharacter[] = characterList.map((character): ICharacter => {
      const {iconType, id} = character
      const iconSrc = characterIcons[iconType][id]

      return Object.assign(character, {iconSrc})
    })
    handleRoomCreate(setting, characters)
    history.push('/room')
  }

  render(): JSX.Element {
    const {
      state,
      props,
      handleRoomNameChange,
      handleCharacterChange,
      handleCreateBtnClick,
    } = this
    const {skillNameList, skillList} = props
    const {roomSetting, characters} = state
    const {name} = roomSetting

    return (
      <div>
        <input type="text" value={name} onChange={(e): void => handleRoomNameChange(e)} placeholder={'Room Name'} />

        <CharacterList characters={characters} skillList={skillList} skillNameList={skillNameList} handleChange={handleCharacterChange} />

        <div onClick={(): void => handleCreateBtnClick(roomSetting, characters)}>Create</div>
      </div>
    )
  }
}

export default withRouter(RoomCreate)