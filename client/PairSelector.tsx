import React, { Component } from 'react'
import { createClassName } from './Util'
import { ICharacter, CharacterCollection, CharacterId, IRelation } from './types/type'
import PairSelectorItem from './PairSelectorItem'
import CharacterSelector from './CharacterSelector'
import Dialog from './Dialog'
import TotalPoint from './TotalPoint'
import CharacterSupportPoint from './CharacterSupportPoint'
import CharacterViewer from './CharacterViewer'

interface IPairSelectorProps {
  characters: ICharacter[]
  maxLength: number
  minLength?: number
  maxTotalPoint: number
  maxPoint: number
  defaultValue?: number[]
  characterSupportPoint: CharacterCollection<number>
  relation: IRelation[]
  handlePairConfirm: (
    supportPairs: {
      pairId: [CharacterId, CharacterId]
      pairPoint: number
    }[],
    characterSupportPoint: CharacterCollection<number>
  ) => void
}

interface IPairSelectorState {
  supportPairs: {
    pairId: CharacterId[]
    pairPoint: number
  }[]
  excludeList: CharacterId[]
  totalPoint: number
  selectingPairIdx?: number
  currentCharacter?: ICharacter
  nextCharacterSupportPoint: CharacterCollection<number>
  isConfirm: boolean
}

class PairSelector extends Component<IPairSelectorProps, IPairSelectorState> {
  constructor(props: IPairSelectorProps) {
    super(props)

    const {characterSupportPoint, defaultValue = []} = props

    const supportPairs: {
      pairId: CharacterId[]
      pairPoint: number
    }[] = []

    for (let i = 0; i < props.maxLength; i++) {
      const pairPoint = defaultValue[i] !== undefined ? defaultValue[i] : 0
      supportPairs.push({
        pairId: [],
        pairPoint,
      })
    }

    this.state = {
      supportPairs,
      excludeList: [],
      totalPoint: 0,
      nextCharacterSupportPoint: Object.assign({}, characterSupportPoint),
      isConfirm: false,
    }

    this.handlePairPointChange = this.handlePairPointChange.bind(this)
    this.handlePairSelectClick = this.handlePairSelectClick.bind(this)
    this.handlePairSelect = this.handlePairSelect.bind(this)
    this.handleCharacterViewerOpen = this.handleCharacterViewerOpen.bind(this)
    this.handleCharacterViewerClose = this.handleCharacterViewerClose.bind(this)
    this.handleConfirmDialogOpen = this.handleConfirmDialogOpen.bind(this)
    this.handleConfirmDialogClose = this.handleConfirmDialogClose.bind(this)
    this.handleConfirmBtnClick = this.handleConfirmBtnClick.bind(this)
    this.renderCharacterSelector = this.renderCharacterSelector.bind(this)
    this.isValidate = this.isValidate.bind(this)
  }

  calcSupportPoint(): {newTotalPoint: number, newCharacterSupportPoint: CharacterCollection<number>} {
    const {characterSupportPoint} = this.props
    const {supportPairs} = this.state
    const newCharacterSupportPoint = Object.assign({}, characterSupportPoint)
    let newTotalPoint = 0

    for (const pair of supportPairs) {
      if (pair.pairId.length === 2) {
        const {pairPoint, pairId} = pair
        const [id1, id2] = pairId
        newTotalPoint += pairPoint

        newCharacterSupportPoint[id1] += pairPoint
        newCharacterSupportPoint[id2] += pairPoint
      }
    }

    return {newTotalPoint, newCharacterSupportPoint}
  }

  handlePairSelectClick(targetPairIdx: number): void {
    this.setState({
      selectingPairIdx: targetPairIdx,
    })
  }

  handlePairSelect(targetIdx: number, ...selectedCharacter: ICharacter[]): void {
    if (selectedCharacter.length > 0) {
      const {supportPairs} = this.state
      const updatedSupportPairs = supportPairs.slice()
      const [selectedChar1, selectedChar2] = selectedCharacter

      updatedSupportPairs[targetIdx].pairId = [selectedChar1.id, selectedChar2.id]

      this.setState({
        supportPairs: updatedSupportPairs,
        selectingPairIdx: undefined,
      })
    } else {
      this.setState({
        selectingPairIdx: undefined,
      })
    }
  }

  handlePairPointChange(point: number, targetPairIdx: number): void {
    const {supportPairs} = this.state
    const updatedPairs = supportPairs.slice()
    const targetPair = updatedPairs[targetPairIdx]

    targetPair.pairPoint = point

    updatedPairs[targetPairIdx] = targetPair

    this.setState({
      supportPairs: updatedPairs,
    })
  }

  handleConfirmBtnClick(): void {
    const {state, props} = this
    const {supportPairs, nextCharacterSupportPoint} = state
    const {handlePairConfirm} = props

    const updatedSupportPairs: {
      pairId: [CharacterId, CharacterId]
      pairPoint: number
    }[] = []

    for (const supportPair of supportPairs) {
      const {pairId, pairPoint} = supportPair
      updatedSupportPairs.push({
        pairId: [pairId[0], pairId[1]],
        pairPoint,
      })
    }

    handlePairConfirm(updatedSupportPairs, nextCharacterSupportPoint)
  }

  handleCharacterViewerOpen(character?: ICharacter): void {
    this.setState({
      currentCharacter: character,
    })
  }

  handleCharacterViewerClose(): void {
    this.setState({
      currentCharacter: undefined,
    })
  }

  handleConfirmDialogOpen(): void {
    this.setState({
      isConfirm: true,
    })
  }

  handleConfirmDialogClose(): void {
    this.setState({
      isConfirm: false,
    })
  }

  createCharSelector(targetPairIdx: number): JSX.Element {
    const {handlePairSelectClick, handlePairPointChange} = this
    const {characters, maxPoint} = this.props
    const {supportPairs} = this.state
    const supportPair = supportPairs[targetPairIdx]

    const {pairId, pairPoint} = supportPair
    const [charId1, charId2] = pairId
    const char1 = characters.find(character => character.id === charId1)
    const char2 = characters.find(character => character.id === charId2)

    return (
      <li className={createClassName('pair-selector', 'item')} key={`pairSelectorListItem${targetPairIdx}`}>
        <PairSelectorItem
          pair={[char1, char2]}
          idx={targetPairIdx}
          value={pairPoint}
          maxValue={maxPoint}
          isSkillActive={false}
          onValueChange={(value): void => handlePairPointChange(value, targetPairIdx)}
          onPairSelect={(): void => handlePairSelectClick(targetPairIdx)}
        />
      </li>
    )
  }

  renderCharacterSelector(selectingPairIdx: number): JSX.Element {
    const {state, props, handlePairSelect} = this
    const {characters, relation} = props
    const {supportPairs} = state
    const selectedCharacters = characters.filter(character => supportPairs[selectingPairIdx].pairId.includes(character.id))
    const otherSelectedIdSet = supportPairs.map(pair => {
      return pair.pairId
    })

    otherSelectedIdSet.splice(selectingPairIdx, 1)
    return (
      <CharacterSelector
        characters={characters}
        targetIdx={selectingPairIdx}
        relation={relation}
        max={2}
        otherSelectedIdSet={otherSelectedIdSet}
        selectedCharacters={selectedCharacters}
        isSkillActive={false}
        onSelect={handlePairSelect}
      />
    )
  }

  isValidate(): boolean {
    const {maxLength, minLength = maxLength, maxTotalPoint} = this.props
    const {supportPairs, totalPoint} = this.state

    const filteringPair = supportPairs.filter((supportPair) => {
      const {pairId, pairPoint} = supportPair
      return pairId.length === 2 && pairPoint > 0
    })

    return (
      minLength <= filteringPair.length && filteringPair.length <= maxLength &&
      maxTotalPoint === totalPoint
    )
  }

  componentDidUpdate(prevProps: IPairSelectorProps, prevState: IPairSelectorState): void {
    const {supportPairs} = this.state

    if (supportPairs !== prevState.supportPairs) {
      const {newTotalPoint, newCharacterSupportPoint} = this.calcSupportPoint()
      this.setState({
        totalPoint: newTotalPoint,
        nextCharacterSupportPoint: newCharacterSupportPoint,
      })
    }
  }

  render(): JSX.Element {
    const {
      props,
      state,
      isValidate,
      handleCharacterViewerOpen,
      handleCharacterViewerClose,
      handleConfirmDialogOpen,
      handleConfirmDialogClose,
      handleConfirmBtnClick,
      renderCharacterSelector,
    } = this
    const {maxLength, minLength, maxPoint, maxTotalPoint, characters, relation, characterSupportPoint} = props
    const {selectingPairIdx, totalPoint, nextCharacterSupportPoint, currentCharacter, isConfirm} = state

    const listItems: JSX.Element[] = []

    for (let i = 0; i < maxLength; i++) {
      listItems.push(this.createCharSelector(i))
    }

    return (
      <Dialog title={'支援するペアを選択してください'} positiveTxt={'確定'} onPositiveFunc={isValidate() ? handleConfirmDialogOpen : undefined}>
        <div className={createClassName('pair-selector')}>
          <div className={createClassName('pair-selector', 'description')}>
            <p className={createClassName('pair-selector', 'lead-text')}>
              {`推したいペアを${minLength !== undefined ? `${minLength}〜${maxLength}` : maxLength}組選び、${maxPoint > 1 ? `それぞれに1〜${maxPoint}` : `${maxPoint}`}点を割り振ってください。数値が高いほど推していることを表現します。`}<br/>
              {`割り振られた値が各キャラクターの支援点となります。この支援点はキャラクターのコントロール権を取得するために必要となります。`}<br />
              {`支援点の合計は常に${maxTotalPoint}点となります。`}
            </p>
            <div className={createClassName('pair-selector', 'total-point')}>
              <TotalPoint maxTotalPoint={maxTotalPoint} currentTotalPoint={totalPoint} />
            </div>
          </div>

          <div className={createClassName('pair-selector', 'select-area')}>
            <ul className={createClassName('pair-selector', 'list')}>
              {listItems}
            </ul>
          </div>

          <div className={createClassName('pair-selector', 'result-area')}>
            <CharacterSupportPoint
              characters={characters}
              characterSupportPoint={characterSupportPoint}
              nextCharacterSupportPoint={nextCharacterSupportPoint}
              onIconClick={handleCharacterViewerOpen}
            />
          </div>
        </div>

        {
          selectingPairIdx !== undefined ? (
            renderCharacterSelector(selectingPairIdx)
          ) : null
        }

        {
          currentCharacter !== undefined ? (
            <Dialog positiveTxt={'閉じる'} onPositiveFunc={handleCharacterViewerClose}>
              <CharacterViewer characters={characters} character={currentCharacter} relation={relation} isSkillActive={false} />
            </Dialog>
          ) : null
        }

        {
          isConfirm ? (
            <Dialog
              title={'確認'}
              positiveTxt={'はい'}
              negativeTxt={'いいえ'}
              onPositiveFunc={handleConfirmBtnClick}
              onNegativeFunc={handleConfirmDialogClose}
            >
              <p>
                支援するペアを確定してよろしいですか？
              </p>
            </Dialog>
          ) : null
        }
      </Dialog>
    )
  }
}

export default PairSelector