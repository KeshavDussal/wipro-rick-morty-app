import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router'
import { lazy } from 'react'
import { Outlet } from 'react-router-dom' // make sure to import Outlet

const CharacterListPage = lazy(() => import('../pages/CharacterListPage'))
const CharacterDetailPage = lazy(() => import('../pages/CharacterDetailPage'))

const rootRoute = createRootRoute({
  component: () => <Outlet />, // Render children
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CharacterListPage,
  validateSearch: (search) => ({
    page: Number(search.page) || 1,
  }),
})

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character/$characterId',
  component: CharacterDetailPage,
})

const routeTree = rootRoute.addChildren([indexRoute, detailRoute])

export const router = createRouter({ routeTree })
