import React, { FC, useState, useCallback, useMemo } from 'react'
import ActionTargetSelectorItem from './ActionTargetSelectorItem'
import { ICharacter, IRelation, CharacterId } from './types/type'

interface IActionSelectorProps {
  activeCharacter: ICharacter
  characters: ICharacter[]
  relation: IRelation[]
  isShow: boolean
  onApproach: (sender: CharacterId, receiver: CharacterId) => void
  onConfess: (sender: CharacterId, receiver: CharacterId) => void
  onLoveGame: (sender: CharacterId, receiver: [CharacterId, CharacterId]) => void
  onDoNothing: () => void
}

const ACTION_TYPE = {
  APPROACH: 'approach',
  CONFESS: 'confess',
  LOVE_GAME: 'loveGame',
  DO_NOTHING: 'doNothing',
}

const ActionSelector: FC<IActionSelectorProps> = ({activeCharacter, characters, relation, isShow, onApproach, onConfess, onLoveGame}) => {
  const relationshipPair = useMemo(() => relation.filter(pair => pair.isRelationship), [relation])
  const haveRelation = useMemo(() => relation.filter(pair => pair.pairId.includes(activeCharacter.id)), [activeCharacter, relation])
  const othersCharacters = useMemo(() => characters.filter(character => character.id !== activeCharacter.id), [activeCharacter])
  const isRelationship: boolean = useMemo(() => {
    return relationshipPair.findIndex((pair) => pair.pairId.includes(activeCharacter.id)) >= 0
  }, [activeCharacter, relation])

  const [actionType, setActionType] = useState<string | null>(null)
  const [approachSelectedCharacter, setApproachSelectedCharacter] = useState<CharacterId | null>(null)
  const [confessSelectedCharacter, setConfessSelectedCharacter] = useState<CharacterId | null>(null)
  const [loveGameSelectedCharacter, setLoveGameSelectedCharacter] = useState<CharacterId[]>([])

  const handleApproachItemClick = useCallback((characterId: CharacterId) => {
    setApproachSelectedCharacter(characterId)
  }, [setApproachSelectedCharacter])
  const handleConfessItemClick = useCallback((characterId: CharacterId) => {
    setConfessSelectedCharacter(characterId)
  }, [setConfessSelectedCharacter])
  const handleLoveGameItemClick = useCallback((characterId: CharacterId) => {
    const updatedLoveGameSelectedCharacters = loveGameSelectedCharacter.slice()
    const selectedIdx = loveGameSelectedCharacter.findIndex(selectedCharacterId => selectedCharacterId === characterId)

    if (selectedIdx >= 0) {
      updatedLoveGameSelectedCharacters.splice(selectedIdx, 1)
      setLoveGameSelectedCharacter(updatedLoveGameSelectedCharacters)
    } else {
      updatedLoveGameSelectedCharacters.push(characterId)
      setLoveGameSelectedCharacter(updatedLoveGameSelectedCharacters)
    }
  }, [loveGameSelectedCharacter, setLoveGameSelectedCharacter])

  const onApproachConfirmBtnClick = useCallback((sender: CharacterId, receiver: CharacterId): void => {
    setActionType(null)
    setApproachSelectedCharacter(null)
    onApproach(sender, receiver)
  }, [onApproach])
  const onConfessConfirmBtnClick = useCallback((sender: CharacterId, receiver: CharacterId): void => {
    setActionType(null)
    setConfessSelectedCharacter(null)
    onConfess(sender, receiver)
  }, [onConfess])
  const onLoveGameConfirmBtnClick = useCallback((sender: CharacterId, receiver: [CharacterId, CharacterId]): void => {
    setActionType(null)
    setConfessSelectedCharacter(null)
    onLoveGame(sender, receiver)
  }, [onLoveGame])

  const approachSelectorElement: JSX.Element = useMemo(() => {
    const characterItems: JSX.Element[] = othersCharacters.map(character => {
      const targetRelation = haveRelation.find((pair) => pair.pairId.includes(activeCharacter.id) && pair.pairId.includes(character.id))
      const isSelectable = !targetRelation || targetRelation.positivePoint !== 6

      if (approachSelectedCharacter === character.id) {
        // 選択済み
        return <ActionTargetSelectorItem character={character} type={'selected'} positivePoint={targetRelation ? targetRelation.positivePoint : 0} negativePoint={targetRelation ? targetRelation.negativePoint : 0} />
      } else if (isSelectable) {
        // 選択可能
        return <ActionTargetSelectorItem character={character} type={'selectable'} positivePoint={targetRelation ? targetRelation.positivePoint : 0} negativePoint={targetRelation ? targetRelation.negativePoint : 0} onClick={handleApproachItemClick} />
      } else {
        // 選択不可
        return <ActionTargetSelectorItem character={character} type={'notSelectable'} positivePoint={targetRelation ? targetRelation.positivePoint : 0} negativePoint={targetRelation ? targetRelation.negativePoint : 0} />
      }
    })

    return (
      <div>
        <ul>
          {characterItems}
        </ul>

        {
          approachSelectedCharacter ? (
            <div onClick={
              (): void => onApproachConfirmBtnClick(activeCharacter.id, approachSelectedCharacter)
            }>
              Confirm
            </div>
          ) : (null)
        }
      </div>
    )
  }, [approachSelectedCharacter, activeCharacter])

  const confessSelectorElement: JSX.Element = useMemo(() => {
    const characterItems: JSX.Element[] = othersCharacters.map(character => {
      const targetRelation = haveRelation.find((pair) => pair.pairId.includes(activeCharacter.id) && pair.pairId.includes(character.id))

      if (confessSelectedCharacter === character.id) {
        // 選択済み
        return <ActionTargetSelectorItem character={character} type={'selected'} positivePoint={targetRelation ? targetRelation.positivePoint : 0} negativePoint={targetRelation ? targetRelation.negativePoint : 0} />
      } else {
        // 選択可能
        return <ActionTargetSelectorItem character={character} type={'selectable'} positivePoint={targetRelation ? targetRelation.positivePoint : 0} negativePoint={targetRelation ? targetRelation.negativePoint : 0} onClick={handleConfessItemClick} />
      }
    })

    return (
      <div>
        <ul>
          {characterItems}
        </ul>

        {
          confessSelectedCharacter ? (
            <div
              onClick={(): void => onConfessConfirmBtnClick(activeCharacter.id, confessSelectedCharacter)}
            >
              Confirm
            </div>
          ) : (null)
        }
      </div>
    )
  }, [confessSelectedCharacter, activeCharacter])

  const loveGameSelectorElement: JSX.Element = useMemo(() => {
    const characterItems: (JSX.Element | null)[] = othersCharacters.map(character => {
      const targetRelation = haveRelation.find((pair) => pair.pairId.includes(activeCharacter.id) && pair.pairId.includes(character.id))
      const isRelationShipCharacter = relationshipPair.find(pair => pair.pairId.includes(character.id)) !== undefined

      if (isRelationShipCharacter) {
        // 選択対象外
        return null
      } else if (loveGameSelectedCharacter && loveGameSelectedCharacter.includes(character.id)) {
        // 選択済み
        return <ActionTargetSelectorItem character={character} type={'selected'} positivePoint={targetRelation ? targetRelation.positivePoint : 0} negativePoint={targetRelation ? targetRelation.negativePoint : 0} onClick={handleLoveGameItemClick} />
      } else if (loveGameSelectedCharacter.length >= 2) {
        // 選択上限
        return <ActionTargetSelectorItem character={character} type={'selectable'} positivePoint={targetRelation ? targetRelation.positivePoint : 0} negativePoint={targetRelation ? targetRelation.negativePoint : 0} />
      } else {
        // 選択可能
        return <ActionTargetSelectorItem character={character} type={'selectable'} positivePoint={targetRelation ? targetRelation.positivePoint : 0} negativePoint={targetRelation ? targetRelation.negativePoint : 0} onClick={handleLoveGameItemClick} />
      }
    })

    return (
      <div>
        <ul>
          {characterItems}
        </ul>

        {
          loveGameSelectedCharacter ? (
            <div
              onClick={
                (): void => {
                  onLoveGameConfirmBtnClick(
                    activeCharacter.id,
                    [loveGameSelectedCharacter[0], loveGameSelectedCharacter[1]]
                  )
                }
              }
            >
              Confirm
            </div>
          ) : (null)
        }
      </div>
    )
  }, [loveGameSelectedCharacter, activeCharacter])

  return (
    isShow ? (
      <div>
        <h2>
          {`${activeCharacter.lastName} ${activeCharacter.firstName}のアクションを選択してください。`}
        </h2>

        <div>
          <dl onClick={(): void => setActionType(ACTION_TYPE.APPROACH)}>
            <dt>
              アプローチ
            </dt>
            <dd>
              対象を選びアプローチします。対象との好感度が１ポイント増加します。<br/>
              <em>行動には常に好感と不満が付き纏う。</em><br/>
              <small>自分か相手に、交際関係の相手がいる場合、カップルの不満度が１ポイント増加します。</small>
            </dd>
          </dl>

          {
            isRelationship ? (
              null
            ) : (
              <dl onClick={(): void => setActionType(ACTION_TYPE.CONFESS)}>
                <dt>
                  告白
                </dt>
                <dd>
                  対象を選び告白します。相手がＯＫした場合、またはＯＫされなくてもダイス判定次第でカップル関係となります。<br/>
                  <em>相手の好意を知って、自覚する恋慕もあるだろう。</em><br/>
                  <small>誰かと交際している場合は告白できません。</small>
                </dd>
              </dl>
            )
          }

          <dl onClick={(): void => setActionType(ACTION_TYPE.LOVE_GAME)}>
            <dt>
              駆け引き
            </dt>
            <dd>
              カップル未成立のペアを対象として、交際すべきかの賛否を、対象ペア以外から多数決を採ります。賛成が過半数に達し、対象ペアがそれぞれ了承した場合はカップル関係になります。<br/>
              <em>誰かが水をやらねば実らぬ恋もある。</em><br/>
              <small>コントロール点を誰も公開していないキャラクターは「反対」を選んだものとして処理されます。</small>
            </dd>
          </dl>

          <dl onClick={(): void => setActionType(ACTION_TYPE.DO_NOTHING)}>
            <dt>
              何もしない
            </dt>
            <dd>
              一切のアクションを行わず、穏やかな日々を過ごします。<br/>
              <em>黙することが育む愛もあるということ。</em><br/>
              <small>コントロール点を誰も公開していないキャラクターは「何もしない」を選んだものとして処理されます。</small>
            </dd>
          </dl>
        </div>

        {
          actionType === ACTION_TYPE.APPROACH ? (
            approachSelectorElement
          ) : null
        }
        {
          actionType === ACTION_TYPE.CONFESS ? (
            confessSelectorElement
          ) : null
        }
        {
          actionType === ACTION_TYPE.LOVE_GAME ? (
            loveGameSelectorElement
          ) : null
        }
      </div>
    ) : null
  )
}

export default ActionSelector