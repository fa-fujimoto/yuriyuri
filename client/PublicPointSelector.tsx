import React, { Component } from 'react'
import createClassName from './util/createClassName'
import Dialog from './Dialog'
import { ICharacter, CharacterCollection, CharacterId } from './types/type'

interface IPublicPointSelectorProps {
  player: string
  member: string[]
  characters: ICharacter[]
  activeCharacter: ICharacter
  supportPoint: number
  publicPoints: CharacterCollection<number[]>
  isShow: boolean
  onClickConfirmBtn: (characterId: CharacterId, point: number) => void
  onClickCancelBtn: (characterId: CharacterId, point: number) => void
}

interface IPublicPointSelectorState {
  tempPublicPoints: CharacterCollection<number[]>
  isShowConfirmDialog: boolean
  isShowCancelDialog: boolean
}

class PublicPointSelector extends Component<IPublicPointSelectorProps, IPublicPointSelectorState> {
  constructor(props: IPublicPointSelectorProps) {
    super(props)

    const memberPublicPoint = props.member.map(() => {
      return 0
    })

    this.state = {
      tempPublicPoints: {
        'black': memberPublicPoint.slice(),
        'gray': memberPublicPoint.slice(),
        'green': memberPublicPoint.slice(),
        'pink': memberPublicPoint.slice(),
        'purple': memberPublicPoint.slice(),
        'red': memberPublicPoint.slice(),
        'sky': memberPublicPoint.slice(),
        'white': memberPublicPoint.slice(),
        'yellow': memberPublicPoint.slice(),
      },
      isShowConfirmDialog: false,
      isShowCancelDialog: false,
    }

    this.handleItemSelect = this.handleItemSelect.bind(this)
  }

  handleItemSelect(characterId: CharacterId, memberIdx: number, point: number): void {
    const updatedPublicPoints = Object.assign({}, this.state.tempPublicPoints)
    updatedPublicPoints[characterId][memberIdx] = point

    this.setState({
      tempPublicPoints: updatedPublicPoints,
    })
  }

  render(): JSX.Element | null {
    const className = 'public-point-selector'
    const {props, state, handleItemSelect} = this
    const {member, player, characters, activeCharacter, supportPoint, publicPoints, isShow, onClickConfirmBtn, onClickCancelBtn} = props
    const {tempPublicPoints, isShowConfirmDialog, isShowCancelDialog} = state
    const playerIdx = member.findIndex((name) => player === name)

    const characterColumn = characters.map((character): JSX.Element => {
      const publicPoint = publicPoints[character.id]
      const tempPublicPoint = tempPublicPoints[character.id]
      const isActive = activeCharacter.id === character.id
      const selectableMax = supportPoint
      const selectableMin = Math.max(...publicPoint) + 1

      const characterColumnItems: JSX.Element[] = []

      if (isActive && selectableMax >= selectableMin) {
        for (let i = 1; i < 21; i++) {
          const isSelectable = selectableMin <= i && i <= selectableMax
          const selectedMemberIdx = tempPublicPoint.findIndex((point) => point === i)

          const columnItem = isSelectable && selectedMemberIdx === -1 ? (
            <li
              className={createClassName(className, 'point-item', 'selectable')}
              onClick={(): void => handleItemSelect(character.id, playerIdx, i)}
            />
          ) : (
            <li className={createClassName(className, 'point-item')}>
              <div className={createClassName(className, 'player-chip', 'temp')}>
                {member[selectedMemberIdx]}
              </div>
            </li>
          )

          characterColumnItems.push(columnItem)
        }

        return (
          <ul className={createClassName(className, 'point-list')}>
            {characterColumnItems}
          </ul>
        )
      } else {
        for (let i = 1; i < 21; i++) {
          const selectedMemberIdx = publicPoint.findIndex((point) => point === i)

          const columnItem = selectedMemberIdx > 0 ? (
            <li className={createClassName(className, 'point-item')}></li>
          ) : (
            <li className={createClassName(className, 'point-item')}>
              <div className={createClassName(className, 'player-chip')}>
                {member[selectedMemberIdx]}
              </div>
            </li>
          )

          characterColumnItems.push(columnItem)
        }

        return (
          <ul className={createClassName(className, 'point-list')}>
            {characterColumnItems}
          </ul>
        )
      }
    })

    const headerItems: JSX.Element[] = []

    for (let i = 1; i < 21; i++) {
      headerItems.push(
        <div className={createClassName(className, 'header-item')}>{i}</div>
      )
    }

    const numberItems: JSX.Element[] = [
      <div className={createClassName(className, 'number-header', 'empty')} />,
    ]
    const characterItems: JSX.Element[] = [
      <div className={createClassName(className, 'number-header', 'empty')} />,
    ]

    for (let i = 0; i < characters.length; i++) {
      const character = characters[i]

      let numberText = ''

      switch (i + 1) {
      case 1:
        numberText = `${i + 1}st`
        break
      case 2:
        numberText = `${i + 1}nd`
        break
      case 3:
        numberText = `${i + 1}rd`
        break
      default:
        numberText = `${i + 1}th`
        break
      }

      numberItems.push(
        <div className={createClassName(className, 'number-item')}>
          {numberText}
        </div>
      )

      characterItems.push(
        <div className={createClassName(className, 'character-item')}>
          <div className={createClassName(className, 'character-icon')}>
            <img src={character.iconSrc} alt={`${character.lastName} ${character.firstName}`} />
          </div>
        </div>
      )
    }

    return (
      isShow ? (
        <div className={className}>
          <div className={createClassName(className, 'table')}>
            <div className={createClassName(className, 'static-area')}>
              <div className={createClassName(className, 'number-column')}>
                {numberItems}
              </div>
              <div className={createClassName(className, 'character-column')}>
                {characterItems}
              </div>
            </div>

            <div className={createClassName(className, 'scroll-area')}>
              <header className={createClassName(className, 'header')}>
                {headerItems}
              </header>
              <section className={createClassName(className, 'body')}>
                {characterColumn}
              </section>
            </div>
          </div>

          <div className={createClassName(className, 'btn-group')}>
            {
              tempPublicPoints[activeCharacter.id][playerIdx] ? (
                <div onClick={(): void => this.setState({isShowConfirmDialog: true})}>確定</div>
              ) : (null)
            }
            <div onClick={(): void => this.setState({isShowCancelDialog: true})}>キャンセル</div>
          </div>

          {
            isShowConfirmDialog ? (
              <Dialog
                title={'点数を公開しますか？'}
                onPositiveFunc={(): void => onClickConfirmBtn(activeCharacter.id, tempPublicPoints[activeCharacter.id][playerIdx])}
                onNegativeFunc={(): void => this.setState({isShowConfirmDialog: false})}
              >
                {`${activeCharacter.lastName} ${activeCharacter.firstName}に${tempPublicPoints[activeCharacter.id][playerIdx]}点公開しますか？`}
              </Dialog>
            ) : (null)
          }
          {
            isShowCancelDialog ? (
              <Dialog
                title={'点数を公開せずに終了しますか？'}
                onPositiveFunc={(): void => onClickCancelBtn(activeCharacter.id, 0)}
                onNegativeFunc={(): void => this.setState({isShowCancelDialog: false})}
              >
                {`${activeCharacter.lastName} ${activeCharacter.firstName}にコントロール点を公開せずに終了しますか？`}
              </Dialog>
            ) : (null)
          }
        </div>
      ) : null
    )
  }
}

export default PublicPointSelector