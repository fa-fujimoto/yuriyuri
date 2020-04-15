import React, { FC, useState, useCallback, useMemo, useEffect } from 'react'
import PublicPointSelector from './PublicPointSelector'
import Diceroll from './Diceroll'
import ActionSelector from './ActionSelector'
import Dialog from './Dialog'
import CutIn from './CutIn'
import {createFullName} from './Util'
import { ICharacter, IRelation, CharacterCollection, IRelationUpdatedParam, IReaction, CharacterId } from './types/type'

interface IActionProps {
  player: string
  member: string[]
  characters: ICharacter[]
  relation: IRelation[]
  characterSupportPoint: CharacterCollection<number>
  publicPoints: CharacterCollection<number[]>
  characterControlRights: CharacterCollection<number | undefined>
  onRelationUpdate: (...updatedRelationParam: IRelationUpdatedParam[]) => void
  onPublicPointUpdate: (
    updatedPublicPoints: CharacterCollection<number[]>,
    updatedCharacterControlRights: CharacterCollection<number | undefined>
  ) => void
  onActionPhaseEnd: () => void
}

const PhaseAction: FC<IActionProps> = ({
  player,
  member,
  characters,
  relation,
  characterSupportPoint,
  publicPoints,
  characterControlRights,
  onRelationUpdate,
  onPublicPointUpdate,
  onActionPhaseEnd,
}) => {
  const [activeCharacterIdx, setActiveCharacterIdx] = useState<number>(0)
  const [reaction, setReaction] = useState<IReaction | undefined>(undefined)
  const [isShowDiceroll, setIsShowDiceroll] = useState<boolean>(false)
  const [isShowCutin, setIsShowCutin] = useState<boolean>(false)

  const activeCharacter = useMemo<ICharacter>(() => characters[activeCharacterIdx], [activeCharacterIdx])
  const actionTargetCharacter = useMemo<ICharacter | undefined>(() => {
    return reaction ? (
      reaction.target[0]
    ) : (
      undefined
    )
  }, [reaction])

  const playerIdx = useMemo<number>(() => member.findIndex(name => name === player), [])
  const playCharacter = useMemo<ICharacter>(() => {
    return reaction && reaction.characters.length > 0 ? reaction.characters[0] : activeCharacter
  }, [reaction, activeCharacter])
  const controlRightIdx = useMemo<number | undefined>(() => {
    return characterControlRights[playCharacter.id]
  }, [characterControlRights, playCharacter])

  const isShowPublicPointSelector = useMemo<boolean>(() => {
    return !isShowCutin && controlRightIdx === undefined
  }, [isShowCutin, controlRightIdx])
  const isShowConfess = useMemo<boolean>(() => {
    return !isShowPublicPointSelector && reaction !== undefined && reaction.characters.length > 0 && reaction.type === 'confess'
  }, [reaction, isShowPublicPointSelector])
  const isShowLoveGame = useMemo<boolean>(() => {
    return !isShowPublicPointSelector && reaction !== undefined && reaction.characters.length > 0 && reaction.type === 'loveGame'
  }, [reaction, isShowPublicPointSelector])
  const isShowLoveGameConfirmation = useMemo<boolean>(() => {
    return !isShowPublicPointSelector && reaction !== undefined && reaction.characters.length > 0 && reaction.type === 'loveGameConfirmation'
  }, [reaction, isShowPublicPointSelector])
  const isShowLoveGameResult = useMemo<boolean>(() => {
    return !isShowPublicPointSelector && reaction !== undefined && reaction.characters.length === 0 && (reaction.type === 'loveGame' || reaction.type === 'loveGameConfirmation')
  }, [reaction, isShowPublicPointSelector])

  const isShowDicerollDialog = useMemo<boolean>(() => {
    return isShowDiceroll && reaction !== undefined && controlRightIdx === playerIdx
  }, [isShowDiceroll, reaction, controlRightIdx])
  const isShowActionSelector = useMemo<boolean>(() => {
    return !isShowDiceroll && reaction === undefined && controlRightIdx === playerIdx
  }, [isShowDiceroll, reaction, controlRightIdx])

  const nextActiveCharacter = useCallback(() => {
    if (characters.length - 1 > activeCharacterIdx) {
      setActiveCharacterIdx(activeCharacterIdx + 1)
    } else {
      setActiveCharacterIdx(0)
      onActionPhaseEnd()
    }
  }, [onActionPhaseEnd, activeCharacterIdx])

  const nextReactionCharacter = useCallback(() => {
    if (reaction) {
      const reactionCharacters = reaction.characters.slice()
      reactionCharacters.shift()

      const updatedReaction = Object.assign({}, reaction)
      updatedReaction.characters = reactionCharacters

      setReaction(updatedReaction)
    }
  }, [reaction])

  const handlePublicPointUpdate = useCallback((characterId: CharacterId, point: number): void => {
    const updatedPublicPoints = Object.assign({}, publicPoints)
    const updatedCharacterControlRights = Object.assign({}, characterControlRights)
    const targetCharacterPoints = updatedPublicPoints[characterId].slice()

    targetCharacterPoints[playerIdx] = point

    let maxControlIdx = -1
    let maxControlPoint = 0

    for (let i = 0; i < targetCharacterPoints.length; i++) {
      const point = targetCharacterPoints[i]

      if (maxControlPoint < point) {
        maxControlPoint = point
        maxControlIdx = i
      }
    }

    updatedPublicPoints[characterId] = targetCharacterPoints
    updatedCharacterControlRights[characterId] = maxControlIdx

    onPublicPointUpdate(updatedPublicPoints, updatedCharacterControlRights)
  }, [onPublicPointUpdate, publicPoints, characterControlRights])

  const handleApproach = useCallback((senderId: CharacterId, receiverId: CharacterId): void => {
    const newRelation: IRelationUpdatedParam = {
      pairId: [senderId, receiverId],
      positivePoint: 1,
    }

    const relationshipPair = relation.filter(pair => {
      return (
        pair.isRelationship &&
        (pair.pairId.includes(senderId) || pair.pairId.includes(receiverId)) &&
        !(pair.pairId.includes(senderId) && pair.pairId.includes(receiverId))
      )
    })
    const relationshipPairAddPoint: IRelationUpdatedParam[] = relationshipPair.map((pair): IRelationUpdatedParam => {
      return {
        pairId: pair.pairId,
        negativePoint: 1,
      }
    })

    onRelationUpdate(newRelation, ...relationshipPairAddPoint)
    nextActiveCharacter()
  }, [onRelationUpdate, relation])

  const handleConfess = useCallback((senderId: CharacterId, receiverId: CharacterId): void => {
    const receiverCharacter = characters.find((character) => character.id === receiverId)

    if (receiverCharacter) {
      const reaction: IReaction = {
        type: 'confess',
        characters: [receiverCharacter],
        result: [],
        target: [receiverCharacter],
      }

      setReaction(reaction)
    }
  }, [])

  const handleLoveGame = useCallback((senderId: CharacterId, receiverId: [CharacterId, CharacterId]): void => {
    const [receiverId1, receiverId2] = receiverId
    const receiverCharacter1 = characters.find((character => character.id === receiverId1))
    const receiverCharacter2 = characters.find((character => character.id === receiverId2))

    const firstAry = characters.slice(activeCharacterIdx)
    const lastAry = characters.slice(0, activeCharacterIdx)

    const voters: ICharacter[] = [...firstAry, ...lastAry].filter((character) => {
      return character.id !== senderId && character.id !== receiverId1 && character.id !== receiverId2
    })

    if (receiverCharacter1 && receiverCharacter2) {
      const reaction: IReaction = {
        type: 'loveGame',
        characters: voters,
        result: [true],
        target: [receiverCharacter1, receiverCharacter2],
      }

      setReaction(reaction)
    }
  }, [])

  const handleLoveGameConfirmation = useCallback((sender: ICharacter, receiver: [ICharacter, ICharacter]): void => {
    const updatedReaction: IReaction = {
      type: 'loveGameConfirmation',
      characters: receiver,
      result: [],
      target: receiver,
    }
    setReaction(updatedReaction)
  }, [])

  const handleDoNothing = useCallback(() => {
    nextActiveCharacter()
  }, [])

  const handleLoveGameSuccess = useCallback(() => {
    if (reaction) {
      const [sender, receiver] = reaction.target

      const newRelation: IRelationUpdatedParam = {
        pairId: [sender.id, receiver.id],
        isRelationship: true,
      }

      onRelationUpdate(newRelation)
    }
  }, [reaction])
  const handleLoveGameFailed = useCallback(() => {
    if (reaction) {
      const [sender, receiver] = reaction.target

      const newRelation: IRelationUpdatedParam = {
        pairId: [sender.id, receiver.id],
        negativePoint: 1,
      }

      onRelationUpdate(newRelation)
    }
  }, [reaction])

  const handleVote = useCallback((votePoint): void => {
    if (reaction) {
      const updatedReaction = Object.assign({}, reaction)
      const reactionCharacters = updatedReaction.characters.slice()
      const reactionResult = updatedReaction.result.slice()

      reactionResult.push(votePoint)
      reactionCharacters.shift()

      updatedReaction.result = reactionResult
      updatedReaction.characters = reactionCharacters

      if (updatedReaction.type === 'loveGame' && updatedReaction.characters.length === 0) {
        const voteTotal = updatedReaction.result.length
        const voteAgreeTotal = updatedReaction.result.filter((point) => point).length
        const voteDisagreeTotal = voteTotal - voteAgreeTotal

        if (voteAgreeTotal > voteDisagreeTotal) {
          handleLoveGameConfirmation(activeCharacter, [reaction.target[0], reaction.target[1]])
        } else {
          setReaction(updatedReaction)
        }

      } else if (updatedReaction.type === 'loveGameConfirmation' && (votePoint === false || updatedReaction.characters.length === 0)) {
        if (!votePoint) {
          updatedReaction.characters = []
          setReaction(updatedReaction)
          handleLoveGameFailed()
        } else {
          setReaction(updatedReaction)
          handleLoveGameSuccess()
        }
      } else {
        setReaction(updatedReaction)
      }

    }
  }, [reaction])

  const handleAgree = useCallback((): void => {
    handleVote(true)
  }, [handleVote])

  const handleDisagree = useCallback((): void => {
    handleVote(false)
  }, [handleVote])


  const handleLoveGameResultConfirm = useCallback(() => {
    setReaction(undefined)
    nextActiveCharacter()
  }, [reaction])

  const handleAppointedLove = useCallback(() => {
    if (actionTargetCharacter) {
      const senderId = activeCharacter.id
      const receiverId = actionTargetCharacter.id

      const newRelation: IRelationUpdatedParam = {
        pairId: [senderId, receiverId],
        isRelationship: true,
      }

      const relationshipPair: IRelation[] = relation.filter((pair): boolean => {
        return pair.isRelationship && pair.pairId.includes(receiverId)
      })
      const relationshipPairAddPoint: IRelationUpdatedParam[] = relationshipPair.map((pair): IRelationUpdatedParam => {
        return {
          pairId: pair.pairId,
          negativePoint: 1,
        }
      })

      onRelationUpdate(newRelation, ...relationshipPairAddPoint)
      setReaction(undefined)
      nextActiveCharacter()
    }
  }, [onRelationUpdate, activeCharacter, actionTargetCharacter, relation])

  const handleDisappointedLove = useCallback((value: number): void => {
    if (actionTargetCharacter) {
      const senderId = activeCharacter.id
      const receiverId = actionTargetCharacter.id

      const targetPair: IRelation | undefined = relation.find((pair): boolean => {
        return pair.pairId.includes(senderId) && pair.pairId.includes(receiverId)
      })
      const positivePoint = targetPair ? targetPair.positivePoint : 0

      if (value <= positivePoint) {
        handleAppointedLove()
      } else {
        const newRelation: IRelationUpdatedParam = {
          pairId: [senderId, receiverId],
          positivePoint: 1,
        }

        onRelationUpdate(newRelation)
        setReaction(undefined)
        nextActiveCharacter()
      }
    }
  }, [onRelationUpdate, actionTargetCharacter, actionTargetCharacter, relation])

  const handleGetConfession = useCallback((): void => {
    if (reaction) {
      nextReactionCharacter()
      handleAppointedLove()
    }
  }, [reaction])

  const handleRefuseConfession = useCallback((): void => {
    if (reaction) {
      nextReactionCharacter()
      setIsShowDiceroll(true)
    }
  }, [reaction])

  const handleDicerollComplete = useCallback((value: number): void => {
    setIsShowDiceroll(false)
    handleDisappointedLove(value)
  }, [])

  const handleCutinEntered = useCallback((): void => {
    setTimeout(() => {
      setIsShowCutin(false)
    }, 800)
  }, [])

  const handleCutinExited = useCallback((): void => {
    return undefined
  }, [controlRightIdx])

  // const handlePublicPointSelectorClose = useCallback(() => setIsShowPublicPointSelector(false), [])

  const renderLoveGameResultDialog = useCallback(() => {
    if (isShowLoveGameResult && reaction) {
      const result = reaction.result.every((answer) => answer)

      return (
        <Dialog title={`駆け引き結果 - ${result ? '成功' : '失敗'}`} positiveTxt={'OK'} onPositiveFunc={handleLoveGameResultConfirm}>
          {
            result ? (
              `駆け引きの結果、${createFullName(reaction.target[0])}と${createFullName(reaction.target[1])}が交際しました。`
            ) : (
              `駆け引きの結果、${createFullName(reaction.target[0])}と${createFullName(reaction.target[1])}は交際しませんでした。`
            )
          }
        </Dialog>
      )
    } else {
      return null
    }
  }, [reaction])
  const loveGameResultConfirmDialog = useMemo(() => renderLoveGameResultDialog(), [isShowLoveGameResult, renderLoveGameResultDialog])

  useEffect(() => {
    setIsShowCutin(true)
  }, [activeCharacterIdx])

  return (
    <>
      <PublicPointSelector
        player={player}
        member={member}
        characters={characters}
        activeCharacter={playCharacter}
        supportPoint={characterSupportPoint[playCharacter.id]}
        publicPoints={publicPoints}
        cellLength={20}
        onClickConfirmBtn={handlePublicPointUpdate}
        onClickCancelBtn={handlePublicPointUpdate}
      />
      <Diceroll
        isShow={isShowDicerollDialog}
        sender={activeCharacter}
        receiver={reaction ? reaction.target[0] : activeCharacter}
        onRollComplete={handleDicerollComplete}
      />
      {
        isShowConfess ? (
          <Dialog title={`${createFullName(activeCharacter)}から告白されました`} positiveTxt={'受ける'} negativeTxt={'断る'} onPositiveFunc={handleGetConfession} onNegativeFunc={handleRefuseConfession}>
            {`${createFullName(playCharacter)}は、${createFullName(activeCharacter)}からの告白を受けますか？`}
          </Dialog>
        ) : null
      }
      {
        isShowLoveGame && reaction ? (
          <Dialog title={`${createFullName(activeCharacter)}の駆け引き`} positiveTxt={'賛成'} negativeTxt={'反対'} onPositiveFunc={handleAgree} onNegativeFunc={handleDisagree}>
            {`${createFullName(activeCharacter)}からの駆け引きの提案です。`}<br />
            {`${createFullName(playCharacter)}は、${createFullName(reaction.target[0])}と${createFullName(reaction.target[1])}の交際に賛成しますか？`}
          </Dialog>
        ) : null
      }
      {
        isShowLoveGameConfirmation && reaction ? (
          <Dialog title={`${createFullName(activeCharacter)}の駆け引き`} positiveTxt={'交際する'} negativeTxt={'交際しない'} onPositiveFunc={handleAgree} onNegativeFunc={handleDisagree}>
            {`${createFullName(activeCharacter)}からの駆け引きの提案が過半数に達しました。`}<br />
            {`${reaction.target.findIndex((character) => character.id === playCharacter.id) === 1 ? createFullName(reaction.target[0]) : createFullName(reaction.target[1])}と交際しますか？`}
          </Dialog>
        ) : null
      }
      {loveGameResultConfirmDialog}
      <ActionSelector
        isShow={isShowActionSelector}
        activeCharacter={activeCharacter}
        characters={characters}
        relation={relation}
        onApproach={handleApproach}
        onConfess={handleConfess}
        onLoveGame={handleLoveGame}
        onDoNothing={handleDoNothing}
      />

      <CutIn isShow={isShowCutin} modifire={activeCharacter.id} onEntered={handleCutinEntered} onExited={handleCutinExited}>
        {`${createFullName(activeCharacter)}のターン`}
      </CutIn>
    </>
  )
}

export default PhaseAction