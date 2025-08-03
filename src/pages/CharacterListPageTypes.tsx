// Base character type containing essential fields used across both list and detail views
export type CharacterBase = {
  id: number
  name: string
  status: string
  species: string
}

// Full character type extending the base with additional detailed fields
export type Character = CharacterBase & {
  gender: string
  origin: { name: string }
  location: { name: string }
  image: string
  created: string
}

// Response type representing paginated list of characters
export type CharactersResponse = {
  results: CharacterBase[]
}
