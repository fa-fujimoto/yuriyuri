import React, { FC, useMemo } from 'react'
import { ICharacter, IRelation } from './types/type'
import { createClassName, createFullName } from './Util'
import CharacterIcon from './CharacterIcon'
import SkillCard from './SkillCard'
import RelationList from './RelationList'

interface ICharacterViewerProps {
  character: ICharacter
  characters: ICharacter[]
  relation: IRelation[]
  isSkillActive: boolean
}

const CharacterViewer: FC<ICharacterViewerProps> = ({character, characters, relation, isSkillActive}) => {
  const targetPair = useMemo<IRelation[]>(() => relation.filter(pair => pair.pairId.includes(character.id)), [relation, character])
  return character ? (
    <div className={createClassName('character-viewer', '', character.id)}>
      <header className={createClassName('character-viewer', 'header')}>
        <h3 className={createClassName('character-viewer', 'name')}>
          {`${createFullName(character)}のプロフィール`}
        </h3>
      </header>

      <div className={createClassName('character-viewer', 'body')}>
        <div className={createClassName('character-viewer', 'string-content')}>

          <div className={createClassName('character-viewer', 'info')}>
            <h4 className={createClassName('character-viewer', 'sub-title')}>情報</h4>
            <dl className={createClassName('character-viewer', 'info-row')}>
              <dt className={createClassName('character-viewer', 'info-title')}>
                誕生日
              </dt>
              <dd className={createClassName('character-viewer', 'info-value')}>
                {`${character.birthday.getFullYear()}年 ${character.birthday.getMonth() + 1}月 ${character.birthday.getDay()}日`}
              </dd>
            </dl>

            <dl className={createClassName('character-viewer', 'info-row')}>
              <dt className={createClassName('character-viewer', 'info-title')}>
                出身地
              </dt>
              <dd className={createClassName('character-viewer', 'info-value')}>
                {character.birthplace}
              </dd>
            </dl>
          </div>

          <div className={createClassName('character-viewer', 'relation')}>
            <h4 className={createClassName('character-viewer', 'sub-title')}>関係性</h4>

            <div className={createClassName('character-viewer', 'relation-list')}>
              {
                targetPair.length > 0 ? (
                  <RelationList character={character} characters={characters} relation={targetPair} />
                ) : (
                  <p className={createClassName('character-viewer', 'relation-empty')}>
                    関係を築いていません
                  </p>
                )
              }
            </div>
          </div>
        </div>

        <div className={createClassName('character-viewer', 'graph-content')}>
          <div className={createClassName('character-viewer', 'icon')}>
            <CharacterIcon
              character={character}
              isSkillActive={false}
              modifire={['md']}
            />
          </div>

          <div className={createClassName('character-viewer', 'skill')}>
            <h4 className={createClassName('character-viewer', 'sub-title')}>性向</h4>
            <ul className={createClassName('character-viewer', 'skill-list')}>
              {
                character.skills.map(skill => {
                  return (
                    <li key={`skillList${skill}`} className={createClassName('character-viewer', 'skill-item')}>
                      <SkillCard skillName={skill} isSkillActive={isSkillActive} />
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default CharacterViewer