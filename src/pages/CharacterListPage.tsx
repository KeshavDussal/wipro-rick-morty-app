import { useQuery } from '@tanstack/react-query'
import { fetchCharacters } from '@/api/rickAndMorty'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type {
  CharacterBase,
  CharactersResponse,
} from './CharacterListPageTypes'

export default function CharacterListPage() {
  const { page = 1 } = useSearch({ strict: false }) as { page?: number }
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data, isLoading, isError, refetch } = useQuery<CharactersResponse>({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
    placeholderData: (previousData) => previousData,
  })

  const characters = data?.results || []

  const changePage = (newPage: number) => {
    window.history.pushState(null, '', `/?page=${newPage}`)
    refetch()
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([
      refetch(),
      new Promise((resolve) => setTimeout(resolve, 500)), // Minimum delay
    ])
    setIsRefreshing(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Character List</h1>
      <button
        className="px-3 py-1 border rounded bg-blue-500 text-white"
        onClick={handleRefresh}
      >
        Refresh
      </button>

      {(isLoading || isRefreshing) && <p>Refreshing...</p>}

      {!isLoading && !isRefreshing && isError && <p>Error loading data</p>}

      {!isLoading && !isRefreshing && !isError && (
        <>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Species</th>
              </tr>
            </thead>
            <tbody>
              {characters.map((char: CharacterBase) => (
                <tr
                  key={char.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate({ to: `/character/${char.id}` })}
                >
                  <td className="p-2 border">{char.id}</td>
                  <td className="p-2 border">{char.name}</td>
                  <td className="p-2 border">{char.status}</td>
                  <td className="p-2 border">{char.species}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex gap-4">
            <button
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => changePage(page - 1)}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => changePage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
