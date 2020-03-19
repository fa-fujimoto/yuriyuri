import React, { FC, useState, useCallback } from 'react'
import { createFullName } from './Util'
import Dialog from './Dialog'
import Diceroll from './Diceroll'
import { ICharacter, IRelation, IRelationUpdatedParam, CharacterId } from './types/type'

interface IPhaseTheKissProps {
  player: string
  member: string[]
  characters: ICharacter[]
  relation: IRelation[]
  turnCount: number
  onRelationUpdate: (...updatedRelationParam: IRelationUpdatedParam[]) => void
  onPhaseEnd: () => void
}

const PhaseTheKiss: FC<IPhaseTheKissProps> = ({
  characters,
  relation,
  turnCount,
  onRelationUpdate,
  onPhaseEnd,
}) => {
  const [relationshipPair, setRelationshipPair] = useState<IRelation[]>(relation.filter(pair => {
    return pair.isRelationship && (turnCount > 1 || !pair.isFirst)
  }))
  const [diceResultData, setDiceResultData] = useState<string>()
  const [isShowDiceroll, setIsShowDiceroll] = useState<boolean>(false)

  const getPairCharacter = useCallback((pairId: [CharacterId, CharacterId]): ICharacter[] => {
    return characters.filter(character => {
      return pairId.includes(character.id)
    })
  }, [characters])

  const handleNextPair = useCallback((relationshipPair: IRelation[]) => {
    const updatedRelationshipPair = relationshipPair
    updatedRelationshipPair.shift()
    setRelationshipPair(updatedRelationshipPair)
  }, [])

  const handleDiceComplete = useCallback((value: number) => {
    const targetPair = relationshipPair[0]
    const [sender, receiver] = getPairCharacter(targetPair.pairId)
    setIsShowDiceroll(false)

    if (targetPair) {
      const result = value + targetPair.positivePoint - targetPair.negativePoint
      const pairNameString = `${createFullName(sender)}と${createFullName(receiver)}`
      let resultString = ''

      if (result >= 4) {
        onRelationUpdate({
          pairId: targetPair.pairId,
          kissCount: 1,
        })

        resultString = `ダイスの目が${value}だったため、${pairNameString}は誓いのキスに成功しました。`
      } else {
        onRelationUpdate({
          pairId: targetPair.pairId,
          kissCount: -1,
        })

        resultString = `ダイスの目が${value}だったため、${pairNameString}は誓いのキスに失敗しました。`
      }

      setDiceResultData(resultString)
    }
  }, [relationshipPair, onRelationUpdate])

  const handleDiceResultConfirm = useCallback(() => {
    setDiceResultData(undefined)
    handleNextPair(relationshipPair)
  }, [relationshipPair])

  const renderTheKissDialog = useCallback((targetPair: IRelation | undefined) => {
    if (targetPair) {
      const [sender, receiver] = getPairCharacter(targetPair.pairId)
      const pairNameString = `${createFullName(sender)}と${createFullName(receiver)}`
      const passingPoint = 4 + targetPair.negativePoint - targetPair.positivePoint

      if (6 >= passingPoint && passingPoint > 1) {
        const passingPointString = passingPoint > 6 ? `${passingPoint}以上` : `${passingPoint}`
        return (
          <>
            <Dialog
              title={`${pairNameString}の誓いのキス判定を行います`}
              positiveTxt={'OK'}
              onPositiveFunc={(): void => setIsShowDiceroll(true)}
            >
              <p>{`${pairNameString}の関係値`}</p>
              <dl>
                <dt>好感度</dt>
                <dd>{targetPair.positivePoint}</dd>
                <dt>不満度</dt>
                <dd>{targetPair.negativePoint}</dd>
              </dl>
              <p>{`ダイスの目が${passingPointString}であれば、誓いのキスに成功します。`}</p>
            </Dialog>

            <Diceroll isShow={isShowDiceroll} sender={sender} receiver={receiver} onRollComplete={handleDiceComplete} />
          </>
        )
      } else {
        return (
          <Dialog
            title={`${pairNameString}の誓いのキス判定を行います`}
            positiveTxt={'OK'}
            onPositiveFunc={(): void => handleDiceComplete(6)}
          >
            <p>{`${createFullName(sender)}と${createFullName(receiver)}の関係値`}</p>
            <dl>
              <dt>好感度</dt>
              <dd>{targetPair.positivePoint}</dd>
              <dt>不満度</dt>
              <dd>{targetPair.negativePoint}</dd>
            </dl>
            <p>
              {`${pairNameString}は、いずれの目が出ても${passingPoint <= 0 ? '成功' : '失敗'}します。`}<br />
              {'最大値の6で判定を進めます。'}
            </p>
          </Dialog>
        )
      }
    } else {
      return (
        <Dialog title={'判定が必要なカップルがいません。'} positiveTxt={'OK'} onPositiveFunc={onPhaseEnd}>
          {'誓いのキスフェイズを終了します。'}
        </Dialog>
      )
    }
  }, [handleDiceComplete])

  const renderDiceResult = useCallback((diceResultData: string | undefined) => {
    return (
      diceResultData ? (
        <Dialog title={'誓いのキス判定結果'} positiveTxt={'OK'} onPositiveFunc={handleDiceResultConfirm}>
          {diceResultData}
        </Dialog>
      ) : null
    )
  }, [handleDiceResultConfirm])

  return (
    <>
      {renderTheKissDialog(relationshipPair[0])}
      {renderDiceResult(diceResultData)}
    </>
  )
}

export default PhaseTheKiss