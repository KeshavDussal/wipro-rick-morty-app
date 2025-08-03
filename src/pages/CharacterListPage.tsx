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

export default function CharacterListPage() {
  const { page = 1 } = useSearch({ strict: false }) as { page?: number }
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const LAST_PAGE = 42
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

  // Define TanStack Table columns
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
  // @ts-ignore
  const table = useReactTable({
    data: characters,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <h1 className="text-[1.5rem] font-bolder italic mb-4 underline mb-[1rem]">
        Character List
      </h1>
      <button
        className="px-[0.4rem] py-[0.2rem] border rounded bg-blue-500 text-white mb-[1rem]"
        onClick={handleRefresh}
      >
        Refresh 🔄
      </button>

      {(isLoading || isRefreshing) && <p>Refreshing...</p>}

      {!isLoading && !isRefreshing && isError && <p>Error loading data</p>}

      {!isLoading && !isRefreshing && !isError && (
        <>
          <div className="overflow-x-auto mt-4 mx-[1rem]">
            <table className="w-full border">
              <thead className="bg-[#9F0712] text-white">
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
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() =>
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

          <div className="flex gap-4 items-center justify-center mt-[1rem] mb-[1rem]">
            {/* Previous Button */}
            <button
              disabled={page === 1}
              className={`px-[0.4rem] py-[0.2rem] border rounded flex items-center gap-1 ${
                page === 1 ? 'opacity-50 bg-[#D3D3D3] cursor-not-allowed' : ''
              }`}
              onClick={() => changePage(page - 1)}
            >
              {page === 1 && <span title="First page"></span>}
              Prev
            </button>

            {/* Current Page Display */}
            <span className="text-sm">Page {page}</span>

            {/* Next Button */}
            <button
              disabled={page === LAST_PAGE}
              className={`px-[0.4rem] py-[0.2rem] border rounded flex items-center gap-1 ${
                page === LAST_PAGE
                  ? 'opacity-50 bg-[#D3D3D3] cursor-not-allowed'
                  : ''
              }`}
              onClick={() => changePage(page + 1)}
            >
              Next
              {page === LAST_PAGE && <span title="Last page"></span>}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
