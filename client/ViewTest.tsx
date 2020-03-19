import React, { FC, useCallback, useState } from 'react'
import { Link, BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import CharacterIcon from './CharacterIcon'
import CutIn from './CutIn'
import CharacterIcons from './data/CharacterIcons'
import DefaultCharacters from './data/DefaultCharacters'
import Dialog from './Dialog'
import Relation from './Relation'
import './src/scss/viewTest.scss'
import Ground from './test/Ground'
import Table from './test/Table'
import { createFullName } from './Util'
import Button from './Button'
import PairSelectorItem from './PairSelectorItem'
import CharacterSelector from './CharacterSelector'
import SkillList from './data/SkillList'
import { ICharacter, IRelation } from './types/type'
import SkillCard from './SkillCard'
import RelationList from './RelationList'
import CharacterViewer from './CharacterViewer'
import PairSelector from './PairSelector'

const characters = DefaultCharacters.map((character): ICharacter => {
  return Object.assign(character, {iconSrc: CharacterIcons[3][character.id]})
})
const maxRelation: IRelation[] = []

for (const sender of characters) {
  const recievers = characters.slice()
  const newRelation: IRelation[] = []

  for (const reciever of recievers) {
    if (sender.id !== reciever.id) {
      newRelation.push(
        {
          pairId: [sender.id, reciever.id],
          positivePoint: 6,
          negativePoint: 6,
          isRelationship: true,
          kissCount: 1,
        }
      )
    }
  }

  recievers.shift()
  maxRelation.push(...newRelation)
}
const charactersMin = characters.slice()
charactersMin.splice(7, 2)

const smallGroupRelationMax: IRelation[] = []
for (const sender of charactersMin) {
  const recievers = charactersMin.slice()
  const newRelation: IRelation[] = []

  for (const reciever of recievers) {
    if (sender.id !== reciever.id) {
      newRelation.push(
        {
          pairId: [sender.id, reciever.id],
          positivePoint: 6,
          negativePoint: 6,
          isRelationship: true,
          kissCount: 1,
        }
      )
    }
  }

  recievers.shift()
  smallGroupRelationMax.push(...newRelation)
}

const firstRelation: IRelation[] = [
  {
    pairId: ['red', 'sky'],
    positivePoint: 2,
    negativePoint: 0,
    isRelationship: true,
    kissCount: 0,
  },
  {
    pairId: ['green', 'yellow'],
    positivePoint: 0,
    negativePoint: 2,
    isRelationship: false,
    kissCount: 0,
  },
  {
    pairId: ['white', 'black'],
    positivePoint: 2,
    negativePoint: 2,
    isRelationship: false,
    kissCount: 0,
  },
]

const ViewTest: FC<{}> = () => {
  const [callbackValue, setCallbackValue] = useState<any[]>([])
  const handleCallback = useCallback((...values: any[]) => {
    if (values.length > 0) {
      setCallbackValue([...values, ...callbackValue])
    } else {
      callbackValue.push('call handle')
      setCallbackValue(callbackValue)
    }
  }, [callbackValue])

  const renderCallbackHistory = useCallback((callbackValue: any[]) => {
    const elements: JSX.Element[] = []

    for (let i = 0; i < callbackValue.length; i++) {
      const value = callbackValue[i]

      elements.push(
        <li key={`callbackValueHistory${i}`}>
          {JSON.stringify(value)}
        </li>
      )
    }

    return elements
  }, [callbackValue])

  return (
    <BrowserRouter>
      <div className="container-fluid">
        <Switch>
          <Route path='/test' exact render={(): JSX.Element => <Table characters={characters} />}/>
          <Route path='/test/CharacterIcon/:id/:size' exact render={(props): JSX.Element => {
            const character = characters.find(character => character.id === props.match.params.id)
            const size = props.match.params.size
            return (
              <Ground>
                <CharacterIcon character={character} modifire={[size]} isShowName={true} isSkillActive={false} onClick={handleCallback} />
              </Ground>
            )
          }} />
          <Route path='/test/CharacterIcon/:id/:size/Disabled' render={(props): JSX.Element => {
            const character = characters.find(character => character.id === props.match.params.id)
            const size = props.match.params.size
            return (
              <Ground>
                <CharacterIcon
                  character={character}
                  modifire={[size]}
                  isShowName={true}
                  isDisabled={true}
                  isSkillActive={false}
                  onClick={handleCallback}
                />
              </Ground>
            )
          }} />
          <Route path='/test/CharacterIcon/:id/:size/Selected' render={(props): JSX.Element => {
            const character = characters.find(character => character.id === props.match.params.id)
            const size = props.match.params.size
            return (
              <Ground>
                <CharacterIcon character={character} modifire={['selected', size]} isShowName={true} isDisabled={true} isSkillActive={false} onClick={handleCallback} />
              </Ground>
            )
          }} />
          <Route path='/test/CharacterIcon/:id/:size/Selecting' render={(props): JSX.Element => {
            const character = characters.find(character => character.id === props.match.params.id)
            const size = props.match.params.size
            return (
              <Ground>
                <CharacterIcon character={character} modifire={['selecting', size]} isShowName={true} isSkillActive={false} onClick={handleCallback} />
              </Ground>
            )
          }} />
          <Route path='/test/Cutin/:id' render={(props): JSX.Element => {
            const character = characters.find(character => character.id === props.match.params.id)
            return (
              character ? (
                <Ground>
                  <CutIn isShow={true} modifire={character.id} onEntered={handleCallback} onExited={handleCallback}>
                    {`${createFullName(character)}のターン`}
                  </CutIn>
                </Ground>
              ) : (
                <Redirect to='/test' />
              )
            )
          }} />

          <Route path='/test/SkillCard/Normal' render={(): JSX.Element => {
            const skillCardList: JSX.Element[] = []

            for (const skill of SkillList) {
              skillCardList.push(<SkillCard key={`skillCardNormal${skill.id}`} skillName={skill.id} isSkillActive={false} />)
            }

            return (
              <Ground>
                {skillCardList}
              </Ground>
            )
          }} />

          <Route path='/test/PairSelectorItem/Empty' render={(): JSX.Element => {
            return (
              <Ground>
                <PairSelectorItem
                  pair={[]}
                  idx={1}
                  value={5}
                  maxValue={5}
                  isSkillActive={false}
                  onValueChange={(value): void => handleCallback(value)}
                  onPairSelect={handleCallback}
                />
              </Ground>
            )
          }} />
          <Route path='/test/PairSelectorItem/Single' render={(): JSX.Element => {
            const [char1] = characters

            return (
              <Ground>
                <PairSelectorItem
                  pair={[char1]}
                  idx={1}
                  value={5}
                  maxValue={5}
                  isSkillActive={false}
                  onValueChange={(value): void => handleCallback(value)}
                  onPairSelect={handleCallback}
                />
              </Ground>
            )
          }} />
          <Route path='/test/PairSelectorItem/Normal' render={(): JSX.Element => {
            const [char1, char2] = characters

            return (
              <Ground>
                <PairSelectorItem
                  pair={[char1, char2]}
                  idx={1}
                  value={5}
                  maxValue={5}
                  isSkillActive={false}
                  onValueChange={(value): void => handleCallback(value)}
                  onPairSelect={handleCallback}
                />
              </Ground>
            )
          }} />

          <Route path='/test/CharacterViewer/Normal' render={(): JSX.Element => {
            return (
              <Ground>
                <CharacterViewer
                  character={characters[0]}
                  characters={characters}
                  relation={maxRelation}
                  isSkillActive={false}
                />
              </Ground>
            )
          }} />

          <Route path='/test/CharacterSelector/Normal' render={(): JSX.Element => {
            return (
              <Ground>
                <CharacterSelector
                  characters={characters}
                  relation={firstRelation}
                  targetIdx={0}
                  max={2}
                  selectedCharacters={[characters[0]]}
                  isSkillActive={false}
                  onSelect={(...characters): void => handleCallback(characters)}
                />
              </Ground>
            )
          }} />

          <Route path='/test/RelationList/Normal' render={(): JSX.Element => {
            return (
              <Ground>
                <RelationList
                  character={characters[0]}
                  characters={characters}
                  relation={maxRelation}
                />
              </Ground>
            )
          }} />

          <Route path='/test/PairSelector/Normal' render={(): JSX.Element => {
            return (
              <Ground>
                <PairSelector
                  characters={characters}
                  maxLength={5}
                  maxTotalPoint={15}
                  maxPoint={5}
                  defaultValue={[5, 4, 3, 2, 1]}
                  characterSupportPoint={
                    {
                      black: 0,
                      gray: 0,
                      green: 0,
                      pink: 0,
                      purple: 0,
                      red: 0,
                      sky: 0,
                      white: 0,
                      yellow: 0,
                    }
                  }
                  relation={firstRelation}
                  handlePairConfirm={handleCallback}
                />
              </Ground>
            )
          }} />

          <Route path='/test/Relation/Normal' render={(): JSX.Element => {
            return (
              <Ground>
                <Relation relation={firstRelation} characters={characters} isSkillActive={false} onClick={handleCallback} />
              </Ground>
            )
          }} />

          <Route path='/test/Relation/smallGroup' render={(): JSX.Element => {
            return (
              <Ground>
                <Relation relation={firstRelation} characters={charactersMin} isSkillActive={false} onClick={handleCallback} />
              </Ground>
            )
          }} />

          <Route path='/test/Relation/Max' render={(): JSX.Element => {
            return (
              <Ground>
                <Relation relation={maxRelation} characters={characters} isSkillActive={false} onClick={handleCallback} />
              </Ground>
            )
          }} />

          <Route path='/test/Relation/smallGroupMax' render={(): JSX.Element => {
            return (
              <Ground>
                <Relation relation={smallGroupRelationMax} characters={charactersMin} isSkillActive={false} onClick={handleCallback} />
              </Ground>
            )
          }} />

          <Route path='/test/Button/Middle' render={(): JSX.Element => {
            return (
              <Ground>
                <Button modifire={'primary'} onClick={handleCallback}>
                  Primary
                </Button>
                <Button modifire={'secondary'} onClick={handleCallback}>
                  Secondary
                </Button>
                <Button modifire={'danger'} onClick={handleCallback}>
                  Danger
                </Button>
              </Ground>
            )
          }} />

          <Route path='/test/Button/Large' render={(): JSX.Element => {
            return (
              <Ground>
                <Button modifire={['primary', 'lg']} onClick={handleCallback}>
                  Primary
                </Button>
                <Button modifire={['secondary', 'lg']} onClick={handleCallback}>
                  Secondary
                </Button>
                <Button modifire={['danger', 'lg']} onClick={handleCallback}>
                  Danger
                </Button>
              </Ground>
            )
          }} />

          <Route path='/test/Button/Small' render={(): JSX.Element => {
            return (
              <Ground>
                <Button modifire={['primary', 'sm']} onClick={handleCallback}>
                  Primary
                </Button>
                <Button modifire={['secondary', 'sm']} onClick={handleCallback}>
                  Secondary
                </Button>
                <Button modifire={['danger', 'sm']} onClick={handleCallback}>
                  Danger
                </Button>
              </Ground>
            )
          }} />

          <Route path='/test/Button/Block' render={(): JSX.Element => {
            return (
              <Ground>
                <Button modifire={['primary', 'block']} onClick={handleCallback}>
                  Primary
                </Button>
                <Button modifire={['secondary', 'block']} onClick={handleCallback}>
                  Secondary
                </Button>
                <Button modifire={['danger', 'block']} onClick={handleCallback}>
                  Danger
                </Button>
              </Ground>
            )
          }} />

          <Route path='/test/Button/Disabled' render={(): JSX.Element => {
            return (
              <Ground>
                <Button modifire={'primary'} onClick={handleCallback} isDisabled={true}>
                  Primary
                </Button>
                <Button modifire={'secondary'} onClick={handleCallback} isDisabled={true}>
                  Secondary
                </Button>
                <Button modifire={'danger'} onClick={handleCallback} isDisabled={true}>
                  Danger
                </Button>
              </Ground>
            )
          }} />

          <Route path='/test/Dialog/Normal' render={(): JSX.Element => {
            return (
              <Ground>
                <Dialog
                  title={'国国国国国国国国国国国国'}
                  positiveTxt={'国国国国'}
                  negativeTxt={'国国'}
                  onPositiveFunc={(): void => handleCallback('click dialog positive')}
                  onNegativeFunc={(): void => handleCallback('click dialog negative')}
                >
                  <p>
                    国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国<br/>
                    国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国
                  </p>
                </Dialog>
              </Ground>
            )
          }} />

          <Table characters={characters} />
        </Switch>

        <ul>
          {renderCallbackHistory(callbackValue)}
        </ul>

        <div>
          <Link className='btn btn-primary' to='/test'>
            BACK
          </Link>
          <div className={'btn btn-danger'} onClick={(): void => setCallbackValue([])}>
            History Clear
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default ViewTest