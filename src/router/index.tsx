import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router'
import { lazy } from 'react'
import { Outlet } from 'react-router-dom'

const CharacterListPage = lazy(() => import('../pages/CharacterListPage'))
const CharacterDetailPage = lazy(() => import('../pages/CharacterDetailPage'))

// Root route with <Outlet /> to render child routes
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// Route for character list with pagination
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CharacterListPage,
  validateSearch: (search): { page: number } => ({
    page: Number(search.page) || 1,
  }),
})

// Route for character detail page
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character/$characterId',
  component: CharacterDetailPage,
})

const routeTree = rootRoute.addChildren([indexRoute, detailRoute])

export const router = createRouter({ routeTree })
