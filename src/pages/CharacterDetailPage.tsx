import { useQuery } from '@tanstack/react-query'
import { fetchCharacterById } from '@/api/rickAndMorty'
import { useParams } from '@tanstack/react-router'
import type { Character } from './CharacterListPageTypes'

export default function CharacterDetailPage() {
  const { id } = useParams({ from: '/character/$id' }) as { id: string }

  const { data, isLoading, isError } = useQuery<Character>({
    queryKey: ['character', id],
    queryFn: () => fetchCharacterById(id),
  })

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    )

  if (isError || !data)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-lg">Error loading character</p>
      </div>
    )

  return (
    <div className="flex justify-center items-center to-white p-6 h-[35rem] mt-[2rem] w-full md:w-[20rem] !important">
      <div className="bg-white rounded-2xl shadow-2xl  border border-gray-200 h-[40rem] mt-[2rem] flex flex-col">
        <div className="relative h-[23rem] w-full overflow-hidden rounded-t-2xl object-fill ">
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-fill object-[center_20%]"
          />
        </div>

        <div className="p-[1rem]">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-[1rem] underline">
            {data.name}
          </h1>

          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="font-semibold">Status:</p>
              <p>{data.status}</p>
            </div>
            <div>
              <p className="font-semibold">Species:</p>
              <p>{data.species}</p>
            </div>
            <div>
              <p className="font-semibold">Gender:</p>
              <p>{data.gender}</p>
            </div>
            <div>
              <p className="font-semibold">Origin:</p>
              <p>{data.origin.name}</p>
            </div>
            <div>
              <p className="font-semibold">Location:</p>
              <p>{data.location.name}</p>
            </div>
            <div>
              <p className="font-semibold">Created:</p>
              <p>{new Date(data.created).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
