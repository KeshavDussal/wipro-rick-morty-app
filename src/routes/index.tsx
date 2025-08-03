import { createFileRoute } from '@tanstack/react-router'
import CharacterListPage from '../pages/CharacterListPage'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <h1 className="text-[3rem] font-[600] text-[#B767C8]">
        Welcome to the Rick and Morty App
      </h1>
      <div className="mt-6">
        <CharacterListPage />
      </div>
    </div>
  )
}
