import { useQuery } from '@tanstack/react-query'
import { fetchCharacters } from '@/api/rickAndMorty'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import type {
  CharacterBase,
  CharactersResponse,
} from './CharacterListPageTypes'
/**
 * Component: CharacterListPage
 *
 * Purpose:
 * Renders list of characters from Rick and Morty character api.
 * Supports pagination, table display, and refresh functionality.
 */
export default function CharacterListPage() {
  // Read query param `page` from URL, defaulting to 1
  const { page = 1 } = useSearch({ strict: false }) as { page?: number }

  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Constants
  const PAGE_SIZE = 15
  const REFRESH_DELAY = 400
  const QUERY_KEY = 'characters'
  const LAST_PAGE = 42

  // Fetch character data using React Query
  const { data, isLoading, isError, refetch } = useQuery<CharactersResponse>({
    queryKey: [QUERY_KEY, page, PAGE_SIZE],
    queryFn: () => fetchCharacters(page, PAGE_SIZE),
    placeholderData: (previousData) => previousData, // Preserve data between queries to prevent flicker
    staleTime: 1000 * 60 * 2,
  })

  const characters = data?.results || []

  // Manually change page and trigger data refetch
  const changePage = (newPage: number) => {
    window.history.pushState(null, '', `/?page=${newPage}`)
    refetch()
  }

  // Handle refresh logic with minimum delay
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([
      refetch(), // Trigger query refetch
      new Promise((resolve) => setTimeout(resolve, REFRESH_DELAY)), // Add delay for consistent UX
    ])
    setIsRefreshing(false)
  }

  // Define table columns using TanStack Table's column helper
  const columnHelper = createColumnHelper<CharacterBase>()
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue()
          let bgColor = ''

          // Determine background color based on status
          switch (status) {
            case 'Alive':
              bgColor = 'bg-green-600'
              break
            case 'Dead':
              bgColor = 'bg-red-600'
              break
            case 'unknown':
              bgColor = 'bg-gray-600'
              break
            default:
              bgColor = 'bg-black'
          }

          return (
            <span
              className={`px-[0.2rem] py-[0.05rem] rounded text-white ${bgColor}`}
            >
              {status}
            </span>
          )
        },
      }),
      columnHelper.accessor('species', {
        header: 'Species',
        cell: (info) => info.getValue(),
      }),
    ],
    [],
  )

  // @ts-ignore Create instance of the table
  const table = useReactTable({
    data: characters,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      {/* Refresh button */}
      <div className="relative mb-[1rem]">
        <button
          className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 mr-4 mt-6 flex items-center gap-1 px-3 py-1.5 rounded-[0.5rem] border border-blue-700 bg-blue-600 text-white font-medium hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleRefresh}
        >
          🔄 <span>Refresh</span>
        </button>
      </div>

      {/* Loading or refreshing state */}
      {(isLoading || isRefreshing) && (
        <div className="flex items-center justify-center min-h-[50vh] text-[3rem]">
          <p className="text-lg font-semibold">Refreshing...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && !isRefreshing && isError && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-red-500 font-medium">Error loading data</p>
        </div>
      )}

      {/* Data table */}
      {!isLoading && !isRefreshing && !isError && (
        <>
          {/* Table display */}
          <div className="overflow-x-auto mt-4 mx-[1rem]">
            <table
              className="w-full border-[#D3D3D3] table-auto rounded-lg overflow-hidden shadow-sm"
              aria-label="Character list"
              role="table"
            >
              <caption className="caption-top text-3xl font-semibold italic underline decoration-blue-500 underline-offset-4 text-center tracking-wide text-gray-800 drop-shadow-sm mb-[1rem]">
                Character List
              </caption>
              <thead className="bg-[#B767C8] text-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="p-[0.3rem] border">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    tabIndex={0}
                    role="button"
                    onClick={() =>
                      navigate({ to: `/character/${row.original.id}` })
                    }
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      navigate({ to: `/character/${row.original.id}` })
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-[0.1rem] border">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex gap-4 items-center justify-center mt-[1rem] mb-[1rem]">
            {/* First page */}
            <button
              disabled={page === 1}
              className={`px-[0.4rem] py-[0.1rem] border rounded flex items-center gap-1 ${
                page === 1 ? 'opacity-50 bg-[#D3D3D3] cursor-not-allowed' : ''
              }`}
              onClick={() => changePage(1)}
            >
              First
            </button>

            {/* Previous page */}
            <button
              disabled={page === 1}
              className={`px-[0.4rem] py-[0.1rem] border rounded flex items-center gap-1 ${
                page === 1 ? 'opacity-50 bg-[#D3D3D3] cursor-not-allowed' : ''
              }`}
              onClick={() => changePage(page - 1)}
            >
              ‹
            </button>

            {/* Current page number */}
            <span className="text-sm">Page {page}</span>

            {/* Next page */}
            <button
              disabled={page === LAST_PAGE}
              className={`px-[0.4rem] py-[0.1rem] border rounded flex items-center gap-1 ${
                page === LAST_PAGE
                  ? 'opacity-50 bg-[#D3D3D3] cursor-not-allowed'
                  : ''
              }`}
              onClick={() => changePage(page + 1)}
            >
              ›
            </button>

            {/* Last page */}
            <button
              disabled={page === LAST_PAGE}
              className={`px-[0.4rem] py-[0.1rem] border rounded flex items-center gap-1 ${
                page === LAST_PAGE
                  ? 'opacity-50 bg-[#D3D3D3] cursor-not-allowed'
                  : ''
              }`}
              onClick={() => changePage(LAST_PAGE)}
            >
              Last
            </button>
          </div>
        </>
      )}
    </div>
  )
}
