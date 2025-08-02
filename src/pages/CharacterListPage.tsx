import { useQuery } from '@tanstack/react-query'
import { fetchCharacters } from '@/api/rickAndMorty'
import { useSearch, useNavigate } from '@tanstack/react-router'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Character, CharactersResponse } from './CharacterListPageTypes'

export default function CharacterListPage() {
  const { page = 1 } = useSearch({ strict: false }) as { page?: number }
  const navigate = useNavigate()

  const { data, isLoading, isError, refetch } = useQuery<CharactersResponse>({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
    keepPreviousData: true,
  })

  const characters = data?.results || []

  const columns: ColumnDef<Character>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'species',
      header: 'Species',
      cell: (info) => info.getValue(),
    },
  ]

  const table = useReactTable({
    data: characters,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const changePage = (newPage: number) => {
    window.history.pushState(null, '', `/?page=${newPage}`)
    refetch()
  }

  return (
    <div>
      <h1 className="text-[1.5rem] font-bold mb-4 underline">Character List</h1>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading data</p>}

      <table className="w-[90%] border border-collapse justify-center mx-auto mt-[0.5rem] ">
        <thead className="bg-yellow-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-[0.4rem] border text-center">
                  {flexRender(
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
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate({ to: `/character/${row.original.id}` })}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-[0.2rem] border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-4 justify-center mt-[1rem]">
        <button
          disabled={page === 1}
          className="px-[0.8rem] py-[0.2rem] border rounded disabled:opacity-50"
          onClick={() => changePage(page - 1)}
        >
          Prev
        </button>
        <button
          className="px-[0.8rem] py-[0.2rem] border rounded"
          onClick={() => changePage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
