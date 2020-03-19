import React, { FC } from 'react'
import SkillList from './data/SkillList'
import { createClassName } from './Util'
import Icon from './Icon'
import { SkillNames } from './types/type'

interface ISkillCardProps {
  skillName: SkillNames
  isSkillActive: boolean
}

const SkillCard: FC<ISkillCardProps> = ({skillName}) => {
  const skillData = SkillList.find(skill => skill.id === skillName)
  return (
    skillData ? (
      <div className={createClassName('skill-card', '', skillName)}>
        <div className={createClassName('skill-card', 'string-area')}>
          <h4 className={createClassName('skill-card', 'name')}>
            {skillData.japanese}
          </h4>
          <span className={createClassName('skill-card', 'decoration-text')}>
            {skillData.name}
          </span>
        </div>

        <div className={createClassName('skill-card', 'graph-area')}>
          <Icon iconName={skillData.iconName} />
        </div>
      </div>
    ) : null
  )
}

export default SkillCard