import { createFileRoute } from '@tanstack/react-router'
import CharacterDetailPage from '@/pages/CharacterDetailPage'

export const Route = createFileRoute('/character/$id')({
  component: CharacterDetailPage,
})
