import { ICharacter } from "client/types/type"

export default function createFullName(character: ICharacter): string {
  return `${character.lastName} ${character.firstName}`
}