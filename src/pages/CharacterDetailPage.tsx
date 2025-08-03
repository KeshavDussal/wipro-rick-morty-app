import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { fetchCharacterById } from '@/api/rickAndMorty'
import type { Character } from './CharacterListPageTypes'

/**
 * Component: CharacterDetailPage
 *
 * Purpose:
 * Renders detailed information about a specific Rick and Morty character.
 * The character data is fetched using the ID provided in the dynamic route.
 */
export default function CharacterDetailPage() {
  // Extract the character ID from the route parameters
  const { id } = useParams({ from: '/character/$id' }) as { id: string }

  // Fetch character data by ID using React Query
  const {
    data: character,
    isLoading,
    isError,
    error,
  } = useQuery<Character>({
    queryKey: ['character', id], // Unique key for caching
    queryFn: () => fetchCharacterById(id), // API call to fetch character
    staleTime: 1000 * 60 * 5,
  })

  // Render loading state while the API request is in progress
  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        role="status"
        aria-label="Loading character details"
      >
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    )
  }

  // Render error message if request fails or data is unavailable
  if (isError || !character) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-red-600 text-lg">
          Error loading character
          {error instanceof Error ? `: ${error.message}` : ''}
        </p>
      </div>
    )
  }

  // Render character detail card once data is successfully fetched
  return (
    <>
      {/* Heading */}
      <h1 className="text-[2rem] font-semibold italic underline decoration-blue-500 underline-offset-4 text-center tracking-wide text-gray-800 drop-shadow-sm mb-6 mt-2">
        Character Detail
      </h1>

      {/* Character card container */}
      <div className="flex justify-center items-center w-full p-6 mt-[2rem]">
        <div
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md"
          aria-labelledby="character-name"
        >
          {/* Character image */}
          <div className="relative h-[23rem] w-full overflow-hidden rounded-t-2xl">
            <img
              src={character.image}
              alt={character.name || 'Character image'}
              className="w-full h-full object-cover object-[center_20%]"
            />
          </div>

          {/* Character information */}
          <div className="p-[1rem]">
            <h2
              id="character-name"
              className="text-3xl font-extrabold text-gray-800 mb-[1rem] underline"
            >
              {character.name}
            </h2>

            {/* Grid layout for metadata */}
            <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
              <DetailItem label="Status" value={character.status} />
              <DetailItem label="Species" value={character.species} />
              <DetailItem label="Gender" value={character.gender} />
              <DetailItem label="Origin" value={character.origin.name} />
              <DetailItem label="Location" value={character.location.name} />
              <DetailItem
                label="Created"
                value={new Date(character.created).toLocaleDateString()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Component: DetailItem
 *
 * Props:
 * - label: string – Descriptive name of the field
 * - value: string – Value associated with the field
 *
 * Description:
 * A reusable label-value component used to display character attributes
 */
const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="font-semibold" aria-label={`${label}`}>
      {label}:
    </p>
    <p>{value}</p>
  </div>
)
