// Base character type with minimal fields
export type CharacterBase = {
  id: number
  name: string
  status: string
  species: string
}

// Full character type extending the base
export type Character = CharacterBase & {
  gender: string
  origin: { name: string }
  location: { name: string }
  image: string
  created: string
}

// Response type for paginated characters
export type CharactersResponse = {
  results: CharacterBase[]
}
