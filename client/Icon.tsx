import React, { FC } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { IconLookup, IconDefinition, findIconDefinition, IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core'

interface IIconProps {
  prefix?: IconPrefix
  iconName: IconName
}

const Icon: FC<IIconProps> = ({iconName, prefix = 'fas'}) => {
  const lookup: IconLookup = { prefix, iconName }
  const iconDefinition: IconDefinition = findIconDefinition(lookup)
  return <FontAwesomeIcon icon={iconDefinition} />
}

export default Icon