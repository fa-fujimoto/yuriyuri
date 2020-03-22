import React, { FC } from 'react'
import { ICharacter, IRelation } from './types/type'
import CharacterIcon from './CharacterIcon'
import { createClassName } from './Util'
import Icon from './Icon'

interface IRelationListProps {
  character: ICharacter
  characters: ICharacter[]
  relation: IRelation[]
}

const RelationList: FC<IRelationListProps> = ({character, characters, relation}) => {
  const innerElement: (JSX.Element | null)[] = relation.map(pair => {
    const targetId = pair.pairId.find(id => id !== character.id)
    const targetCharacter: ICharacter | undefined = targetId ? characters.find(character => character.id === targetId) : targetId

    return (
      targetCharacter ? (
        <li key={`relationList${character.id}${targetCharacter.id}`} className={createClassName('relation-list', 'item', targetCharacter.id)}>
          <div className={createClassName('relation-list', 'icon')}>
            <CharacterIcon character={targetCharacter} modifire={['sm']} isSkillActive={false} />
          </div>

          <div className={createClassName('relation-list', 'info')}>
            <div className={createClassName('relation-list', 'info-item', 'positive')}>
              <dl className={createClassName('relation-list', 'info-item-inner')}>
                <dt className={createClassName('relation-list', 'info-label')}>
                  <span className={createClassName('relation-list', 'info-icon')}>
                    <Icon iconName={'plus-circle'} />
                  </span>
                  好感度
                </dt>
                <dd className={createClassName('relation-list', 'info-value')}>
                  {pair.positivePoint}
                </dd>
              </dl>
            </div>

            <div className={createClassName('relation-list', 'info-item', 'negative')}>
              <dl className={createClassName('relation-list', 'info-item-inner')}>
                <dt className={createClassName('relation-list', 'info-label')}>
                  <span className={createClassName('relation-list', 'info-icon')}>
                    <Icon iconName={'minus-circle'} />
                  </span>
                  不満度
                </dt>
                <dd className={createClassName('relation-list', 'info-value')}>
                  {pair.negativePoint}
                </dd>
              </dl>
            </div>

            <div className={createClassName('relation-list', 'info-item', pair.isRelationship ? 'relationship-true' : 'relationship-false')}>
              <dl className={createClassName('relation-list', 'info-item-inner')}>
                <dt className={createClassName('relation-list', 'info-label')}>
                  <span className={createClassName('relation-list', 'info-icon')}>
                    <Icon iconName={'heart'} />
                  </span>
                  状況
                </dt>
                <dd className={createClassName('relation-list', 'info-value')}>
                  {pair.isRelationship ? '交際中' : '友人'}
                </dd>
              </dl>
            </div>

            {
              pair.isRelationship ? (
                <div className={createClassName('relation-list', 'info-item', 'kiss-count')}>
                  <dl className={createClassName('relation-list', 'info-item-inner')}>
                    <dt className={createClassName('relation-list', 'info-label')}>
                      <span className={createClassName('relation-list', 'info-icon')}>
                        <Icon iconName={'praying-hands'} />
                      </span>
                      誓いのキス
                    </dt>
                    <dd className={createClassName('relation-list', 'info-value')}>
                      {`${pair.kissCount}回`}
                    </dd>
                  </dl>
                </div>
              ) : (
                <div className={createClassName('relation-list', 'info-item', 'empty')}>
                  <dl className={createClassName('relation-list', 'info-item-inner')}>
                    <dt className={createClassName('relation-list', 'info-label')}></dt>
                    <dd className={createClassName('relation-list', 'info-value')}></dd>
                  </dl>
                </div>
              )
            }
          </div>
        </li>
      ) : null
    )
  })

  return (
    <div className={createClassName('relation-list')}>
      <ul className={createClassName('relation-list', 'inner')}>
        {innerElement}
      </ul>
    </div>
  )
}

export default RelationList