import React, { FC, useMemo, useState, useCallback } from 'react'
import Dialog from './Dialog'
import { ICharacter, CharacterCollection, CharacterId } from './types/type'
import { createClassName, createFullName } from './Util'
import PublicPointList from './PublicPointList'
import MemberMarker from './MemberMarker'

interface IPublicPointSelectorProps {
  player: string
  member: string[]
  characters: ICharacter[]
  activeCharacter: ICharacter
  supportPoint: number
  publicPoints: CharacterCollection<number[]>
  cellLength: number
  onClickConfirmBtn: (characterId: CharacterId, point: number) => void
  onClickCancelBtn: (characterId: CharacterId, point: number) => void
}

const PublicPointSelector: FC<IPublicPointSelectorProps> = ({
  player,
  member,
  characters,
  activeCharacter,
  supportPoint,
  publicPoints,
  cellLength,
  onClickConfirmBtn,
  onClickCancelBtn,
}) => {
  const playerIdx = useMemo<number>(() => member.findIndex((name) => name === player), [member])

  const [tempPublicPoints, setTempPublicPoints] = useState<number[]>(member.map(() => 0))
  const [isShowConfirmDialog, setIsShowConfirmDialog] = useState<boolean>(false)
  const [isShowCancelDialog, setIsShowCancelDialog] = useState<boolean>(false)

  const handlePointSelect = useCallback(point => {
    const updatedTempPublicPoints = tempPublicPoints.slice()
    updatedTempPublicPoints[playerIdx] = point
    setTempPublicPoints(updatedTempPublicPoints)
  }, [tempPublicPoints])

  const handleConfirmDialogPositive = useCallback(() => {
    onClickConfirmBtn(activeCharacter.id, tempPublicPoints[playerIdx])
  }, [activeCharacter, tempPublicPoints])

  const handleConfirmDialogNegative = useCallback(() => {
    setIsShowConfirmDialog(false)
  }, [])

  const handleCancelDialogPositive = useCallback(() => {
    onClickCancelBtn(activeCharacter.id, publicPoints[activeCharacter.id][playerIdx])
  }, [])

  const handleCancelDialogNegative = useCallback(() => {
    setIsShowCancelDialog(false)
  }, [])

  const isSelected = useMemo<boolean>(() => tempPublicPoints[playerIdx] > 0, [tempPublicPoints, playerIdx])

  const textAreaElem = useMemo<JSX.Element>(() => {
    return (
      <div className={createClassName('public-point-selector', 'description-area')}>
        <p className={createClassName('public-point-selector', 'text')}>
          {`${createFullName(activeCharacter)}のコントロールを取得したい場合、コントロール点を公開してください。最も大きいコントロール点を公開したプレイヤーが${createFullName(activeCharacter)}のコントロールを取得します。`}
        </p>

        <p className={createClassName('public-point-selector', 'annotation')}>
          コントロール点の公開はアクションフェーズの各タイミングで行うことができますが、公開したコントロール点を減らすことはできません。
        </p>

        {
          supportPoint === 0 ? (
            <p className={createClassName('public-point-selector', 'annotation', 'danger')}>
              {`あなたは${createFullName(activeCharacter)}に対して公開できるコントロール点を所持していません。`}
            </p>
          ) : undefined
        }
      </div>
    )
  }, [activeCharacter, supportPoint])

  const selectAreaElem = useMemo<JSX.Element>(() => {
    return (
      <div className={createClassName('public-point-selector', 'select-area')}>
        <div className={createClassName('public-point-selector', 'table')}>
          <PublicPointList
            characters={characters}
            activeCharacter={activeCharacter}
            supportPoint={supportPoint}
            cellLength={cellLength}
            publicPoints={publicPoints}
            tempPublicPoints={tempPublicPoints}
            onPointSelect={handlePointSelect}
          />
        </div>
      </div>
    )
  }, [activeCharacter, supportPoint, cellLength, publicPoints, tempPublicPoints, handlePointSelect])

  const infoAreaElem = useMemo<JSX.Element>(() => {
    return (
      <div className={createClassName('public-point-selector', 'info-area')}>
        <ul className={createClassName('public-point-selector', 'member-list')}>
          {
            member.map((name, idx) => {
              return (
                <li key={idx} className={createClassName('public-point-selector', 'member-item')}>
                  <dl className={createClassName('public-point-selector', 'member-info')}>
                    <dt className={createClassName('public-point-selector', 'member-icon')}>
                      <MemberMarker idx={idx} />
                    </dt>
                    <dd className={createClassName('public-point-selector', 'member-name')}>
                      {name}
                    </dd>
                  </dl>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }, [member])

  return (
    <Dialog
      title={'公開する点数を選択してください。'}
      positiveTxt={'決定'}
      dangerTxt={'終了'}
      onPositiveFunc={
        isSelected ? (
          (): void => setIsShowConfirmDialog(true)
        ) : undefined
      }
      onDangerFunc={() => setIsShowCancelDialog(true)}
    >
      <div className={createClassName('public-point-selector')}>
        {textAreaElem}

        {selectAreaElem}

        {infoAreaElem}
      </div>

      {
        isShowConfirmDialog ? (
          <Dialog
            title={'点数を確定してよろしいですか？'}
            positiveTxt={'確定'}
            negativeTxt={'取り消し'}
            onPositiveFunc={handleConfirmDialogPositive}
            onNegativeFunc={handleConfirmDialogNegative}
          >
            {`${createFullName(activeCharacter)}に対して${tempPublicPoints[playerIdx]}点のコントロール点を公開してよろしいですか？`}
          </Dialog>
        ) : undefined
      }

      {
        isShowCancelDialog ? (
          <Dialog
            title={'点数を公開せずに終了しますか？'}
            positiveTxt={'終了'}
            negativeTxt={'キャンセル'}
            onPositiveFunc={handleCancelDialogPositive}
            onNegativeFunc={handleCancelDialogNegative}
          >
            {`${createFullName(activeCharacter)}に対してコントロール点を公開せずに終了してよろしいですか？`}
          </Dialog>
        ) : undefined
      }

    </Dialog>
  )
}

export default PublicPointSelector