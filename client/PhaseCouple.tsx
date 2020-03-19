import React, { FC, useState, useCallback } from 'react'
import Diceroll from './Diceroll'
import Dialog from './Dialog'
import { createFullName } from './Util'
import { ICharacter, IRelation, IRelationUpdatedParam } from './types/type'

interface IPhaseCoupleProps {
  player: string
  member: string[]
  characters: ICharacter[]
  relation: IRelation[]
  onRelationUpdate: (...updatedRelationParam: IRelationUpdatedParam[]) => void
  onPhaseEnd: () => void
}

const PhaseCouple: FC<IPhaseCoupleProps> = ({
  characters,
  relation,
  onRelationUpdate,
  onPhaseEnd,
}) => {
  const [relationshipPair, setRelationshipPair] = useState<IRelation[]>(relation.filter(pair => pair.isRelationship))
  const [isShowDiceroll, setIsShowDiceroll] = useState<boolean>(false)
  const [diceResultData, setDiceResultData] = useState<string | undefined>()
  const [lastFuncResultDialogData, setLastFunctResultDialogData] = useState<IRelationUpdatedParam[]>()

  const handleCoupleLastFunction = useCallback(() => {
    const updatedRelation: IRelationUpdatedParam[] = relation.filter(pair => {
      return pair.positivePoint === 6 || pair.negativePoint === 6
    }).map((pair): IRelationUpdatedParam => {
      if (pair.positivePoint === 6 && !pair.isRelationship) {
        return {pairId: pair.pairId, isRelationship: true}
      } else if (pair.negativePoint === 6 && pair.isRelationship) {
        return {pairId: pair.pairId, isRelationship: false}
      } else {
        return {pairId: pair.pairId}
      }
    })

    if (updatedRelation.length > 0) {
      setLastFunctResultDialogData(updatedRelation)
      onRelationUpdate(...updatedRelation)
    } else {
      onPhaseEnd()
    }
  }, [onRelationUpdate, relation])

  const handleNextPair = useCallback(() => {
    relationshipPair.shift()

    setRelationshipPair(relationshipPair)

    if (relationshipPair.length === 0) {
      handleCoupleLastFunction()
    }
  }, [handleCoupleLastFunction, relationshipPair])

  const handleDicerollComplete = useCallback((value: number) => {
    setIsShowDiceroll(false)
    const targetPair = relationshipPair[0]

    if (targetPair) {
      const resultValue = value - targetPair.negativePoint
      const pairCharacter = characters.filter(character => {
        return targetPair.pairId.includes(character.id)
      })
      let resultMessage = ''

      if (value === 6) {
        onRelationUpdate({pairId: targetPair.pairId, positivePoint: 1})
        resultMessage = `ダイスの目が${value}だったため、${createFullName(pairCharacter[0])}と${createFullName(pairCharacter[1])}の好感度が1ポイント加点されました。`
      } else {
        switch (resultValue) {
        case 5:
        case 4:
        case 3:
          resultMessage = `ダイスの目が${value}だったため、${createFullName(pairCharacter[0])}と${createFullName(pairCharacter[1])}の間には何も起きませんでした。`
          break
        case 2:
        case 1:
          onRelationUpdate({pairId: targetPair.pairId, negativePoint: 1})
          resultMessage = `ダイスの目が${value}だったため、${createFullName(pairCharacter[0])}と${createFullName(pairCharacter[1])}の不満度が1ポイント加点されました。`
          break
        default:
          onRelationUpdate({pairId: targetPair.pairId, isRelationship: false})
          resultMessage = `ダイスの目が${value}だったため、${createFullName(pairCharacter[0])}と${createFullName(pairCharacter[1])}は別れました。`
          break
        }
      }

      setDiceResultData(resultMessage)
    }
  }, [relationshipPair])

  const handleDiceResultConfirm = useCallback(() => {
    setDiceResultData(undefined)
    handleNextPair()
  }, [])

  const handleLastFuncResultDialogConfirm = useCallback(() => {
    setLastFunctResultDialogData(undefined)
    onPhaseEnd()
  }, [onPhaseEnd])

  const renderDialog = useCallback((relationshipPair, isShowDiceroll: boolean) => {
    const targetPair = relationshipPair[0]

    if (targetPair) {
      const {pairId, positivePoint, negativePoint} = targetPair
      const [senderId, receiverId] = pairId
      const sender = characters.find(character => senderId === character.id)
      const receiver = characters.find(character => receiverId === character.id)

      const breakUpPoint = negativePoint === 6 ? 5 : negativePoint
      const negativeAddPoint = [negativePoint + 1, negativePoint + 2].filter(point => point < 6)
      const doNothingPoint = [negativePoint + 3, negativePoint + 4, negativePoint + 5].filter(point => {
        return point < 6
      })

      const breakUpPointString = breakUpPoint === 1 ? `${breakUpPoint}` : `${breakUpPoint}以下`

      return (
        sender && receiver ? (
          <>
            <Dialog title={`${createFullName(sender)}と${createFullName(receiver)}の判定を行います`} positiveTxt={'OK'} onPositiveFunc={(): void => setIsShowDiceroll(true)}>
              <p>{`${createFullName(sender)}と${createFullName(receiver)}の関係値`}</p>
              <dl>
                <dt>好感度</dt>
                <dd>{positivePoint}</dd>
                <dt>不満度</dt>
                <dd>{negativePoint}</dd>
              </dl>

              <ul>
                {
                  breakUpPoint > 0 ? (
                    <li>
                      {`出目が${breakUpPointString}の場合、カップルは別れます。`}
                    </li>
                  ) : null
                }
                {
                  negativeAddPoint.length > 0 ? (
                    <li>
                      {`出目が${negativeAddPoint.join('、')}の場合、不満度が1ポイント加点されます。`}
                    </li>
                  ) : null
                }
                {
                  doNothingPoint.length > 0 ? (
                    <li>
                      {`出目が${doNothingPoint.join('、')}の場合、何もしません。`}
                    </li>
                  ) : null
                }
                <li>
                  {'出目が6の場合、好感度が1ポイント加点されます。'}
                </li>
              </ul>
            </Dialog>

            <Diceroll
              isShow={isShowDiceroll}
              sender={sender}
              receiver={receiver}
              onRollComplete={(): void => handleDicerollComplete(6)}
            />
          </>
        ) : null
      )
    } else if (lastFuncResultDialogData === undefined) {
      return (
        <Dialog title={'判定が必要なカップルがいません。'} positiveTxt={'OK'} onPositiveFunc={handleCoupleLastFunction}>
          {'カップルフェイズを終了します。'}
        </Dialog>
      )
    } else {
      return null
    }
  }, [handleDicerollComplete, lastFuncResultDialogData])

  const renderDiceResultDialog = useCallback((diceResultMessage: string | undefined) => {
    return (
      diceResultMessage ? (
        <Dialog title={'ダイス判定結果'} positiveTxt={'OK'} onPositiveFunc={handleDiceResultConfirm}>
          {diceResultMessage}
        </Dialog>
      ) : null
    )
  }, [])

  const renderLastFuncResultDialog = useCallback((updatedRelation: IRelationUpdatedParam[] | undefined) => {
    if (updatedRelation && updatedRelation.length > 0) {
      const resultElem: JSX.Element[] = []

      for (const param of updatedRelation) {
        const {pairId, isRelationship} = param
        const pairCharacter = characters.filter(character => pairId.includes(character.id))
        const pairNameString = `${createFullName(pairCharacter[0])}と${createFullName(pairCharacter[1])}`

        resultElem.push(
          <li key={`coupleLastFunctionResult${pairId.join()}`}>
            {
              isRelationship ? (
                `好感度が6点に達したので${pairNameString}はカップルになりました。`
              ) : (
                `不満度が6点に達したので${pairNameString}は別れました。`
              )
            }
          </li>
        )
      }

      return (
        <Dialog title={'感情値の増減により関係性に変化が起こりました。'} positiveTxt={'OK'} onPositiveFunc={handleLastFuncResultDialogConfirm}>
          {resultElem}
        </Dialog>
      )
    } else {
      return null
    }
  }, [handleLastFuncResultDialogConfirm])

  return (
    <>
      {renderDialog(relationshipPair, isShowDiceroll)}
      {renderDiceResultDialog(diceResultData)}
      {renderLastFuncResultDialog(lastFuncResultDialogData)}
    </>
  )
}

export default PhaseCouple