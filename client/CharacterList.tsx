import React, { Component } from 'react'
import CharacterListItem from './CharacterListItem'
import { IDefaultCharacter, ISkill, SkillNames, ISkillSelectorInfo } from './types/type'

interface ICharacterListProps {
  characters: IDefaultCharacter[]
  skillList: ISkill[]
  skillNameList: SkillNames[]
  handleChange: (newCharacters: IDefaultCharacter[]) => void
}

interface ICharacterListState {
  skillSelectorInfo?: ISkillSelectorInfo
}

class CharacterList extends Component<ICharacterListProps, ICharacterListState> {
  constructor(props: ICharacterListProps) {
    super(props)

    this.state = {
      skillSelectorInfo: undefined,
    }

    this.handleCharactersChange = this.handleCharactersChange.bind(this)
    this.handleSkillSectorInfoChange = this.handleSkillSectorInfoChange.bind(this)
    this.handleSkillsChange = this.handleSkillsChange.bind(this)
  }

  handleCharactersChange(newCharacter: IDefaultCharacter): void {
    const {characters, handleChange} = this.props
    const characterIdx = characters.findIndex((character) => character.id === newCharacter.id)

    if (characterIdx >= 0) {
      const updatedCharacters = characters.slice()
      updatedCharacters[characterIdx] = newCharacter

      handleChange(updatedCharacters)
    }
  }

  handleSkillSectorInfoChange(skillSelectorInfo?: ISkillSelectorInfo): void {
    this.setState({
      skillSelectorInfo,
    })
  }

  handleSkillsChange(characterId: string, skillNumber: number, selectItem: SkillNames): void {
    const {characters, handleChange} = this.props
    const targetIdx = characters.findIndex((character) => character.id === characterId)

    if (targetIdx >= 0) {
      const newCharacters = characters.slice()
      newCharacters[targetIdx].skills[skillNumber] = selectItem

      handleChange(newCharacters)
    }
  }

  render(): JSX.Element {
    const {handleCharactersChange, handleSkillSectorInfoChange, state, props} = this
    const {skillSelectorInfo} = state
    const {characters, skillList, skillNameList} = props

    const characterItemElement: JSX.Element[] = characters.map(character => {
      return <CharacterListItem key={`character${character.id}`} character={character} skillList={skillList} SkillNameList={skillNameList} skillSelectorInfo={skillSelectorInfo} handleChange={handleCharactersChange} handleSkillSelectorInfoChange={handleSkillSectorInfoChange} />
    })

    return (
      <div>
        {characterItemElement}
      </div>
    )
  }
}

export default CharacterList