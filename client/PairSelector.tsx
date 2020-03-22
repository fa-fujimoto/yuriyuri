import React, { Component } from 'react'
import { createClassName } from './Util'
import { ICharacter, CharacterCollection, CharacterId, IRelation } from './types/type'
import PairSelectorItem from './PairSelectorItem'
import CharacterSelector from './CharacterSelector'
import Dialog from './Dialog'

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
  characterSupportPoint: CharacterCollection<number>
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
      totalPoint: defaultValue.length > 0 ? defaultValue.reduce((result, value): number => { return result + value }) : 0,
      characterSupportPoint: Object.assign({}, characterSupportPoint),
    }

    this.handlePairPointChange = this.handlePairPointChange.bind(this)
    this.handlePairIconClick = this.handlePairIconClick.bind(this)
    this.handlePairSelectClick = this.handlePairSelectClick.bind(this)
    this.handlePairSelect = this.handlePairSelect.bind(this)
    this.handleConfirmBtnClick = this.handleConfirmBtnClick.bind(this)
    this.renderCharacterSelector = this.renderCharacterSelector.bind(this)
    this.isValidate = this.isValidate.bind(this)
  }

  handlePairIconClick(selectingPairIdx: number, selectId: CharacterId): void {
    const {supportPairs, characterSupportPoint} = this.state
    const pairId = supportPairs[selectingPairIdx].pairId.slice()
    const targetIdx = pairId.findIndex(id => id === selectId)

    if (targetIdx >= 0) {
      pairId.splice(targetIdx, 1)
      characterSupportPoint[selectId] -= supportPairs[selectingPairIdx].pairPoint
    } else if (pairId.length < 2) {
      pairId.push(selectId)
      characterSupportPoint[selectId] += supportPairs[selectingPairIdx].pairPoint
    }

    supportPairs[selectingPairIdx].pairId = pairId

    this.setState({
      supportPairs,
      characterSupportPoint,
    })
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
    const {supportPairs, totalPoint, characterSupportPoint} = this.state
    const updatedPairs = Object.assign({}, supportPairs)
    const updatedCharacterSupportPoint = Object.assign({}, characterSupportPoint)
    const targetPair = updatedPairs[targetPairIdx]
    const {pairId} = targetPair
    const [charId1, charId2] = pairId

    const diff = point - targetPair.pairPoint

    targetPair.pairPoint = point

    updatedPairs[targetPairIdx] = targetPair
    updatedCharacterSupportPoint[charId1] += diff
    updatedCharacterSupportPoint[charId2] += diff

    this.setState({
      totalPoint: totalPoint + diff,
      supportPairs,
      characterSupportPoint: updatedCharacterSupportPoint,
    })
  }

  handleConfirmBtnClick(): void {
    const {state, props} = this
    const {supportPairs, characterSupportPoint} = state
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

    handlePairConfirm(updatedSupportPairs, characterSupportPoint)
  }

  createPairSelectList(targetPairIdx: number, pairId: CharacterId[], excludeList: CharacterId[]): JSX.Element {
    const {handlePairIconClick, props} = this
    const {characters} = props

    const selectListItems: JSX.Element[] = characters.map(character => {
      const selectIdx = pairId.findIndex(id => id === character.id)
      const disableIdx = excludeList.findIndex(id => id === character.id)

      const defaultStyle: React.CSSProperties = {display: 'inline-block', padding: '5px'}
      const style: React.CSSProperties = selectIdx >= 0 ? {backgroundColor: 'blue'} : {}


      if (selectIdx < 0 && disableIdx >= 0) {
        return (
          <li style={Object.assign(defaultStyle, {backgroundColor: '#eee'})}>
            <img src={character.iconSrc} width="100" style={{opacity: '.5'}} />
          </li>
        )
      } else {
        return (
          <li
            style={Object.assign(defaultStyle, style)}
            onClick={(): void => handlePairIconClick(targetPairIdx, character.id)}
          >
            <img src={character.iconSrc} width="100" />
          </li>
        )
      }
    })

    return (
      <ul>
        {selectListItems}
      </ul>
    )
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
      <li key={`pairSelectorListItem${targetPairIdx}`}>
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

  createCharacterSupportPointTotal(): JSX.Element | null {
    const {characters} = this.props
    const {characterSupportPoint} = this.state
    let isRender = false

    const listItem: (JSX.Element | null)[] = characters.map((character): JSX.Element | null => {
      const point = characterSupportPoint[character.id]

      if (point > 0) {
        if (!isRender) isRender = true
        return (
          <li style={{display: 'inline-block'}}>
            <img src={character.iconSrc} width='100' />
            <span>{point}</span>
          </li>
        )
      } else {
        return null
      }
    })

    if (isRender) {
      return (
        <ul>
          {listItem}
        </ul>
      )
    } else {
      return null
    }
  }

  renderCharacterSelector(selectingPairIdx: number): JSX.Element | null {
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

  render(): JSX.Element {
    const {props, state, isValidate, handleConfirmBtnClick, renderCharacterSelector} = this
    const {maxLength} = props
    const {selectingPairIdx} = state
    const characterSupportPointElem: JSX.Element | null = this.createCharacterSupportPointTotal()

    const listItems: JSX.Element[] = []

    for (let i = 0; i < maxLength; i++) {
      listItems.push(this.createCharSelector(i))
    }

    return (
      <>
        {
          selectingPairIdx !== undefined ? (
            renderCharacterSelector(selectingPairIdx)
          ) : (
            <Dialog title={'支援するペアを選択してください'} positiveTxt={'確定'} onPositiveFunc={isValidate() ? handleConfirmBtnClick : undefined}>
              <div className={createClassName('pair-selector')}>
                <div className={createClassName('pair-selector', 'box')}>
                  {/* total: {totalPoint} */}
                  <div className={createClassName('pair-selector', 'pair-content')}>
                    <ul>
                      {listItems}
                    </ul>
                  </div>

                  {characterSupportPointElem}
                </div>
              </div>
            </Dialog>
          )
        }
      </>
    )
  }
}

export default PairSelector