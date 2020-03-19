import React, { Component } from 'react'
import PairSelector from './PairSelector'
import TurnView from './TurnView'
import PhaseAction from './PhaseAction'
import CutIn from './CutIn'
import PhaseCouple from './PhaseCouple'
import PhaseTheKiss from './PhaseTheKiss'
import Relation from './Relation'
import { IRoom, IReaction, ICharacter, IRelation, CharacterId, CharacterCollection, IRelationUpdatedParam } from './types/type'

interface IRoomItemProps {
  room: IRoom
  player: string
}

interface IRoomItemState {
  name: string
  gameMaster: string
  member: string[]
  turnCount: number
  activeCharacterIdx: number
  reaction?: IReaction
  activePlayerIdx: number
  characters: ICharacter[]
  isStart: boolean
  relation: IRelation[]
  supportPairs: {
    pairId: [CharacterId, CharacterId]
    pairPoint: number
  }[]
  characterSupportPoint: CharacterCollection<number>
  publicPoints: CharacterCollection<number[]>
  characterControlRights: CharacterCollection<number | undefined>
  phase: string
  isShowCutin: boolean
}

const PHASE = {
  INITIALIZE: 'initialize',
  SUPPORTED_PAIR_SELECT: 'supportedPairSelect',
  ACTION: 'action',
  COUPLE: 'couple',
  THE_KISS: 'theKiss',
  SUPPORTED_PAIR_ADD: 'supportedPairAdd',
}

class Room extends Component<IRoomItemProps, IRoomItemState> {
  constructor(props: IRoomItemProps) {
    super(props)

    const {name, gameMaster, member, characters} = props.room

    const relation = name.length > 0 ? this.initRelation(characters) : []
    const shuffledCharacters = this.charactersShuffle(characters)

    const memberPublicPoint = [gameMaster, ...member].map(() => {
      return 0
    })

    this.state = {
      name,
      gameMaster,
      member: [gameMaster, ...member],
      turnCount: 0,
      characters: shuffledCharacters,
      activeCharacterIdx: 0,
      activePlayerIdx: -1,
      isStart: false,
      relation,
      supportPairs: [],
      characterSupportPoint: {
        'black': 0,
        'gray': 0,
        'green': 0,
        'pink': 0,
        'purple': 0,
        'red': 0,
        'sky': 0,
        'white': 0,
        'yellow': 0,
      },
      publicPoints: {
        'black': memberPublicPoint,
        'gray': memberPublicPoint,
        'green': memberPublicPoint,
        'pink': memberPublicPoint,
        'purple': memberPublicPoint,
        'red': memberPublicPoint,
        'sky': memberPublicPoint,
        'white': memberPublicPoint,
        'yellow': memberPublicPoint,
      },
      characterControlRights: {
        'black': undefined,
        'gray': undefined,
        'green': undefined,
        'pink': undefined,
        'purple': undefined,
        'red': undefined,
        'sky': undefined,
        'white': undefined,
        'yellow': undefined,
      },
      phase: PHASE.INITIALIZE,
      isShowCutin: false,
    }

    this.handleRelationShuffle = this.handleRelationShuffle.bind(this)
    this.handleRelationInitializeFinish = this.handleRelationInitializeFinish.bind(this)
    this.handleInitSupportPoint = this.handleInitSupportPoint.bind(this)
    this.handleUpdatedSupportPoint = this.handleUpdatedSupportPoint.bind(this)
    this.handlePublicPointUpdate = this.handlePublicPointUpdate.bind(this)
    this.handleRelationUpdate = this.handleRelationUpdate.bind(this)
    this.handleCutinEntered = this.handleCutinEntered.bind(this)
    this.handleCutinExited = this.handleCutinExited.bind(this)
    this.handleActionPhaseEnd = this.handleActionPhaseEnd.bind(this)
    this.handleCouplePhaseEnd = this.handleCouplePhaseEnd.bind(this)
    this.handleTheKissPhaseEnd = this.handleTheKissPhaseEnd.bind(this)
    this.handleSupportPairAddPhaseEnd = this.handleSupportPairAddPhaseEnd.bind(this)
  }

  initRelation(characters: ICharacter[]): IRelation[] {
    let relation: IRelation[] = []
    const relationshipedPair = this.getRandomRelationTarget(characters)
    const positivePoint2Pair = this.getRandomRelationTarget(characters)
    let positivePoint1Pair1 = this.getRandomRelationTarget(characters)
    let positivePoint1Pair2 = this.getRandomRelationTarget(characters)

    while (this.relationEqual(positivePoint2Pair, positivePoint1Pair1)) {
      positivePoint1Pair1 = this.getRandomRelationTarget(characters)
    }

    while (this.relationEqual(positivePoint2Pair, positivePoint1Pair2) || this.relationEqual(positivePoint1Pair1, positivePoint1Pair2)) {
      positivePoint1Pair2 = this.getRandomRelationTarget(characters)
    }

    relation = this.createRelation(relation, {pairId: relationshipedPair, isRelationship: true, isFirst: true})
    relation = this.createRelation(relation, {pairId: positivePoint2Pair, positivePoint: 2})
    relation = this.createRelation(relation, {pairId: positivePoint1Pair1, positivePoint: 1})
    relation = this.createRelation(relation, {pairId: positivePoint1Pair2, positivePoint: 1})

    return relation
  }

  createRelation(
    relation: IRelation[],
    ...params: IRelationUpdatedParam[]
  ): IRelation[] {
    const updatedRelation = relation.slice()
    const defaultParam = {
      positivePoint: 0,
      negativePoint: 0,
      kissCount: 0,
      isRelationship: false,
    }

    for (const param of params) {
      const {pairId} = param
      const targetPairIdx = updatedRelation.findIndex(pair => this.relationEqual(pairId, pair.pairId))

      if (targetPairIdx >= 0) {
        const existingPair = Object.assign({}, updatedRelation[targetPairIdx])
        const {positivePoint = 0, negativePoint = 0, kissCount = 0, isRelationship} = param

        if (existingPair.isRelationship && isRelationship === false) {
          updatedRelation.splice(targetPairIdx, 1)
        } else {
          const newPositivePoint = existingPair.positivePoint + positivePoint
          const newNegativePoint = existingPair.negativePoint + negativePoint
          const newKissCount = existingPair.kissCount + kissCount

          existingPair.positivePoint = newPositivePoint <= 6 ? newPositivePoint : 6
          existingPair.negativePoint = newNegativePoint <= 6 ? newNegativePoint : 6
          existingPair.kissCount = newKissCount <= 2 ? newKissCount : 2

          if (isRelationship !== undefined) existingPair.isRelationship = isRelationship

          updatedRelation[targetPairIdx] = existingPair
        }
      } else {
        updatedRelation.push(Object.assign(defaultParam, param))
      }
    }

    return updatedRelation
  }

  relationEqual(pair1: [string, string], pair2: [string, string]): boolean {
    return pair1.find(id => id === pair2[0]) && pair1.find(id => id === pair2[1]) ? true : false
  }

  getRandomRelationTarget(characters: ICharacter[]): [CharacterId, CharacterId] {
    const shuffledList = this.charactersShuffle(characters)
    const r = Math.floor(Math.random() * (characters.length - 1))
    return [shuffledList[r].id, shuffledList[r + 1].id]
  }

  charactersShuffle(characters: ICharacter[]): ICharacter[] {
    const shufffledCharacters: ICharacter[] = characters.slice()

    for (let i = shufffledCharacters.length - 1; i >= 0; i--) {
      const r = Math.floor(Math.random() * (shufffledCharacters.length))
      const tmp = shufffledCharacters.slice()[i]
      shufffledCharacters[i] = shufffledCharacters.slice()[r]
      shufffledCharacters[r] = tmp
    }

    return shufffledCharacters
  }

  handleRelationShuffle(): void {
    const {characters} = this.state
    const relation = this.initRelation(characters)
    const shuffledCharacters = this.charactersShuffle(characters)

    this.setState({
      characters: shuffledCharacters,
      relation,
    })
  }

  handleRelationInitializeFinish(): void {
    this.setState({
      phase: PHASE.SUPPORTED_PAIR_SELECT,
    })
  }

  handleUpdatedSupportPoint(
    updatedSupportPairs: {
      pairId: [CharacterId, CharacterId]
      pairPoint: number
    }[],
    updatedCharacterSupportPoint: CharacterCollection<number>,
    isInit = false
  ): void {
    const {supportPairs, characterSupportPoint, characters, turnCount, phase} = this.state

    for (let i = 0; i < updatedSupportPairs.length; i++) {
      const updatedSupportPair = updatedSupportPairs[i]

      const existingPairIdx = supportPairs.findIndex(supportPair => {
        return this.relationEqual(supportPair.pairId, updatedSupportPair.pairId)
      })

      if (existingPairIdx >= 0) {
        supportPairs[existingPairIdx].pairPoint += updatedSupportPair.pairPoint
      } else {
        supportPairs.push(updatedSupportPair)
      }
    }

    for (const character of characters) {
      const {id} = character

      characterSupportPoint[id] += updatedCharacterSupportPoint[id]
    }

    const updatedState = {
      supportPairs,
      characterSupportPoint,
      phase,
      turnCount,
    }

    if (isInit) {
      updatedState.phase = PHASE.ACTION
    }

    this.setState(updatedState)
  }

  handleInitSupportPoint(
    updatedSupportPairs: {
      pairId: [CharacterId, CharacterId]
      pairPoint: number
    }[],
    updatedCharacterSupportPoint: CharacterCollection<number>,
  ): void {
    this.handleUpdatedSupportPoint(updatedSupportPairs, updatedCharacterSupportPoint, true)
  }

  handleRelationUpdate(...updatedRelationParam: IRelationUpdatedParam[]): void {
    const updatedRelation = this.createRelation(this.state.relation, ...updatedRelationParam)
    this.setState({
      relation: updatedRelation,
    })
  }
  handlePublicPointUpdate(
    updatedPublicPoints: CharacterCollection<number[]>,
    updatedCharacterControlRights: CharacterCollection<number | undefined>
  ): void {
    this.setState({
      publicPoints: updatedPublicPoints,
      characterControlRights: updatedCharacterControlRights,
    })
  }

  handleCutinEntered(): void {
    setTimeout(() => {
      this.setState({
        isShowCutin: false,
      })
    }, 800)
  }

  handleCutinExited(): void {
    return undefined
  }

  handleActionPhaseEnd(): void {
    this.setState({
      phase: PHASE.COUPLE,
    })
  }

  handleCouplePhaseEnd(): void {
    this.setState({
      phase: PHASE.THE_KISS,
    })
  }

  handleTheKissPhaseEnd(): void {
    const {turnCount} = this.state
    const nextPhase = turnCount === 3 || turnCount === 6 ? PHASE.SUPPORTED_PAIR_SELECT : PHASE.ACTION
    this.setState({
      phase: nextPhase,
    })
  }

  handleSupportPairAddPhaseEnd(): void {
    this.setState({
      phase: PHASE.ACTION,
    })
  }

  componentDidMount(): void {
    this.setState({
      isShowCutin: true,
    })
  }
  componentDidUpdate(prevProps: IRoomItemProps, prevState: IRoomItemState): void {
    const {activeCharacterIdx, phase, characters, turnCount} = this.state

    if (prevState.phase !== phase) {
      if (phase === PHASE.ACTION) {
        this.setState({
          isShowCutin: true,
          turnCount: turnCount + 1,
        })
      } else {
        this.setState({
          isShowCutin: true,
        })
      }
    }

    if (phase === PHASE.ACTION) {
      if (prevState.activeCharacterIdx === characters.length - 1 && activeCharacterIdx === 0) {
        this.setState({phase: PHASE.COUPLE})
      } else if (prevState.turnCount === 0) {
        this.setState({turnCount: 1})
      }
    }
  }

  render(): JSX.Element {
    const {
      state,
      props,
      handleRelationShuffle,
      handleRelationInitializeFinish,
      handleInitSupportPoint,
      handlePublicPointUpdate,
      handleRelationUpdate,
      handleCutinEntered,
      handleCutinExited,
      handleActionPhaseEnd,
      handleCouplePhaseEnd,
      handleTheKissPhaseEnd,
    } = this
    const {player} = props
    const {
      relation,
      characters,
      member,
      turnCount,
      activeCharacterIdx,
      characterSupportPoint,
      characterControlRights,
      publicPoints,
      phase,
      isShowCutin,
    } = state

    let phaseText = ''

    switch (phase) {
    case PHASE.INITIALIZE:
      phaseText = 'セットアップ'
      break

    case PHASE.SUPPORTED_PAIR_SELECT:
      phaseText = '支援点の選択'
      break

    case PHASE.ACTION:
      phaseText = 'アクションフェーズ'
      break

    case PHASE.COUPLE:
      phaseText = 'カップルのフェーズ'
      break

    case PHASE.THE_KISS:
      phaseText = '誓いのキスのフェーズ'
      break

    default:
      break
    }

    return (
      <div style={{position: 'relative', paddingTop: '160px'}}>
        <TurnView turnCount={turnCount} turnOrder={characters} activeCharacterIdx={activeCharacterIdx} />

        <Relation relation={relation} characters={characters} isSkillActive={false} />

        {
          phase === PHASE.ACTION && !isShowCutin ? (
            <PhaseAction
              player={player}
              member={member}
              characters={characters}
              relation={relation}
              characterSupportPoint={characterSupportPoint}
              publicPoints={publicPoints}
              characterControlRights={characterControlRights}
              onRelationUpdate={handleRelationUpdate}
              onPublicPointUpdate={handlePublicPointUpdate}
              onActionPhaseEnd={handleActionPhaseEnd}
            />
          ) : null
        }

        {
          phase === PHASE.COUPLE && !isShowCutin ? (
            <PhaseCouple
              player={player}
              member={member}
              characters={characters}
              relation={relation}
              onRelationUpdate={handleRelationUpdate}
              onPhaseEnd={handleCouplePhaseEnd}
            />
          ): null
        }

        {
          phase === PHASE.THE_KISS && !isShowCutin ? (
            <PhaseTheKiss
              player={player}
              member={member}
              characters={characters}
              relation={relation}
              turnCount={turnCount}
              onRelationUpdate={handleRelationUpdate}
              onPhaseEnd={handleTheKissPhaseEnd}
            />
          ) : null
        }

        {
          phase === PHASE.INITIALIZE && !isShowCutin ? (
            <div>
              <div onClick={handleRelationShuffle}>shuffle</div>
              <div onClick={handleRelationInitializeFinish}>Relation initialize finish</div>
            </div>
          ) : null
        }

        {
          phase === PHASE.SUPPORTED_PAIR_SELECT && !isShowCutin ? (
            <PairSelector
              characters={characters}
              relation={relation}
              maxLength={5}
              maxTotalPoint={15}
              maxPoint={5}
              characterSupportPoint={characterSupportPoint}
              defaultValue={[5, 4, 3, 2, 1]}
              handlePairConfirm={handleInitSupportPoint}
            />
          ) : null
        }

        <CutIn isShow={isShowCutin} modifire={'phase'} onEntered={handleCutinEntered} onExited={handleCutinExited}>
          {phaseText}
        </CutIn>
      </div>
    )
  }
}

export default Room