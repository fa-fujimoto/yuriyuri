import React, { FormEvent } from 'react'
import SkillSelector from './SkillSelector'
import { IDefaultCharacter, ISkill, SkillNames, ISkillSelectorInfo } from './types/type'

interface ICharacterListItemProps {
  character: IDefaultCharacter
  skillList: ISkill[]
  SkillNameList: SkillNames[]
  skillSelectorInfo?: ISkillSelectorInfo
  handleChange: (newCharacter: IDefaultCharacter) => void
  handleSkillSelectorInfoChange: (skillSelectorInfo?: ISkillSelectorInfo) => void
}

function CharacterListItem(props: ICharacterListItemProps): JSX.Element {
  const {character, skillList, skillSelectorInfo, handleChange, handleSkillSelectorInfoChange} = props

  const handleLastNameChange = (event: FormEvent<HTMLInputElement>): void => {
    character.lastName = event.currentTarget.value
    handleChange(character)
  }

  const handleFirstNameChange = (event: FormEvent<HTMLInputElement>): void => {
    character.firstName = event.currentTarget.value
    handleChange(character)
  }

  const handleBirthdayChange = (event: FormEvent<HTMLInputElement>): void => {
    character.birthday = new Date(event.currentTarget.value)
    handleChange(character)
  }

  const handleBirthplaceChange = (event: FormEvent<HTMLInputElement>): void => {
    character.birthplace = event.currentTarget.value
    handleChange(character)
  }

  const handleWordsChange = (event: FormEvent<HTMLInputElement>, wordsNumber: number): void => {
    character.words[wordsNumber] = event.currentTarget.value
    handleChange(character)
  }

  const handleSkillsChange = (skills: [SkillNames, SkillNames]): void => {
    character.skills = skills
    handleChange(character)
  }

  const handleSkillSelectorShow = (skillNumber: number, currentSelectSkill: SkillNames, selectedSkill: SkillNames): void => {
    const characterId = character.id
    const updateSkillSelectorInfo: ISkillSelectorInfo = {
      characterId,
      skillNumber,
      currentSelectSkill,
      selectedSkill,
    }
    handleSkillSelectorInfoChange(updateSkillSelectorInfo)
  }

  const handleSkillSelectorHide = (): void => {
    handleSkillSelectorInfoChange()
  }

  const {id, lastName, firstName, birthday, birthplace, words, skills} = character

  const wordsInput = words.map((value, idx) => {
    return <input key={`character${id}words${idx}`} type="text" value={value} onChange={(e): void => handleWordsChange(e, idx)} placeholder={`word ${idx}`} />
  })

  const birthdayDate = `${birthday.getFullYear()}-${("0" + (birthday.getMonth() + 1)).slice(-2)}-${("0" + birthday.getDate()).slice(-2)}`

  return (
    <div>
      <figure></figure>
      <div>
        <input type="text" value={lastName} onChange={handleLastNameChange} placeholder={'lastName'} />
        <input type="text" value={firstName} onChange={handleFirstNameChange} placeholder={'firstName'} />
      </div>
      <div>
        <input type="date" value={birthdayDate} onChange={handleBirthdayChange} placeholder={'Birthday'} />
      </div>
      <div>
        <input type="text" value={birthplace} onChange={handleBirthplaceChange} />
      </div>

      <div>
        {wordsInput}
      </div>

      <SkillSelector
        characterId={id}
        skills={skills}
        skillList={skillList}
        skillSelectorInfo={skillSelectorInfo}
        handleSkillsCardClick={handleSkillsChange}
        handleSkillSelectorOpen={handleSkillSelectorShow}
        handleSkillSelectorClose={handleSkillSelectorHide}
      />
    </div>
  )
}

export default CharacterListItem