export type Character = {
  id: number
  name: string
  status: string
  species: string
}

export type CharactersResponse = {
  results: Character[]
}
