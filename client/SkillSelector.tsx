import React from 'react'
import { SkillNames, ISkill, ISkillSelectorInfo } from './types/type'

interface ISkillSelectorProps {
  characterId: string
  skills: [SkillNames, SkillNames]
  skillList: ISkill[]
  skillSelectorInfo?: ISkillSelectorInfo
  handleSkillsCardClick: (skills: [SkillNames, SkillNames]) => void
  handleSkillSelectorOpen: (skillNumber: number, currentSelectSkill: SkillNames, selectedSkill: SkillNames) => void
  handleSkillSelectorClose: () => void
}

function SkillSelector(props: ISkillSelectorProps): JSX.Element {
  const {
    characterId,
    skills,
    skillList,
    skillSelectorInfo,
    handleSkillsCardClick,
    handleSkillSelectorOpen,
    handleSkillSelectorClose,
  } = props

  const [skillInfo1, skillInfo2] = skillList.filter(skill => skills.includes(skill.id))

  const skillSelectItemList = (): JSX.Element | null => {
    if (skillSelectorInfo && skillSelectorInfo.characterId === characterId) {
      const {currentSelectSkill, selectedSkill, skillNumber} = skillSelectorInfo

      const onClick = (newSkill: SkillNames): void => {
        if (selectedSkill !== newSkill) {
          skills[skillNumber] = newSkill
          handleSkillsCardClick(skills)
          handleSkillSelectorClose()
        }
      }

      const items = skillList.map((skill) => {
        let selectedItem: JSX.Element | null = null

        if (currentSelectSkill === skill.id) {
          selectedItem = <p>選択中</p>
        } else if (selectedSkill === skill.id) {
          selectedItem = <p>選択済み</p>
        }

        return (
          <div key={`${characterId}${skill.id}`} onClick={(): void => onClick(skill.id)}>
            {`${skill.name} - ${skill.japanese}`}
            <small>{skill.overview}</small>
            {selectedItem}
          </div>
        )
      })

      return (
        <div>
          {items}
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <div>
      <div onClick={(): void => handleSkillSelectorOpen(0, skills[0], skills[1])}>
        <p>
          {`${skillInfo1.name} - ${skillInfo1.japanese}`}
          <small>{skillInfo1.overview}</small>
        </p>
      </div>

      <div onClick={(): void => handleSkillSelectorOpen(1, skills[1], skills[0])}>
        <p>
          {`${skillInfo2.name} - ${skillInfo2.japanese}`}
          <small>{skillInfo2.overview}</small>
        </p>
      </div>

      {skillSelectItemList()}
    </div>
  )
}

export default SkillSelector