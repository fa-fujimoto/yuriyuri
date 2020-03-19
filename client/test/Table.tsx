import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import {ICharacter} from '../types/type'

interface ITableProps {
  characters: ICharacter[]
}

const Table: FC<ITableProps> = ({characters}) => {
  const characterIconRow: JSX.Element[] = []
  const cutinRow: JSX.Element[] = []

  for (const character of characters) {
    characterIconRow.push(
      <tr key={`characterIconRow${character.id}`}>
        <td>
          <Link to={`/test/CharacterIcon/${character.id}/md`}>CharacterIcon - {character.id}</Link>
        </td>
      </tr>
    )

    characterIconRow.push(
      <tr key={`characterIconDisabledRow${character.id}`}>
        <td>
          <Link to={`/test/CharacterIcon/${character.id}/md/Disabled`}>CharacterIcon - {character.id} - Disabled</Link>
        </td>
      </tr>
    )

    characterIconRow.push(
      <tr key={`characterIconSelectedRow${character.id}`}>
        <td>
          <Link to={`/test/CharacterIcon/${character.id}/md/Selected`}>CharacterIcon - {character.id} - Selected</Link>
        </td>
      </tr>
    )

    characterIconRow.push(
      <tr key={`characterIconSelectingRow${character.id}`}>
        <td>
          <Link to={`/test/CharacterIcon/${character.id}/md/Selecting`}>CharacterIcon - {character.id} - Selecting</Link>
        </td>
      </tr>
    )

    cutinRow.push(
      <tr key={`cutinRow${character.id}`}>
        <td>
          <Link to={`/test/Cutin/${character.id}`}>Cutin - {character.id}</Link>
        </td>
      </tr>
    )
  }

  return (
    <table className='table table-striped'>
      <tbody>
        {characterIconRow}
        {cutinRow}
        <tr>
          <td>
            <Link to={'/test/Relation/Normal'}>Relation - Normal</Link>
          </td>
        </tr>
        <tr>
          <td>
            <Link to={'/test/Relation/smallGroup'}>Relation - SmallGroup</Link>
          </td>
        </tr>
        <tr>
          <td>
            <Link to={'/test/Relation/Max'}>Relation - Max</Link>
          </td>
        </tr>
        <tr>
          <td>
            <Link to={'/test/Relation/SmallGroupMax'}>Relation - SmallGroup - Max</Link>
          </td>
        </tr>

        <tr>
          <td>
            <Link to={'/test/Button/Middle'}>Button - Middle</Link>
          </td>
        </tr>
        <tr>
          <td>
            <Link to={'/test/Button/Large'}>Button - Large</Link>
          </td>
        </tr>
        <tr>
          <td>
            <Link to={'/test/Button/Small'}>Button - Small</Link>
          </td>
        </tr>

        <tr>
          <td>
            <Link to={'/test/Button/Block'}>Button - Block</Link>
          </td>
        </tr>
        <tr>
          <td>
            <Link to={'/test/Button/Disabled'}>Button - Disabled</Link>
          </td>
        </tr>

        <tr>
          <td>
            <Link to={'/test/Dialog/Normal'}>Dialog - Normal</Link>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default Table