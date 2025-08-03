import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router'
import { lazy } from 'react'
import { Outlet } from 'react-router-dom'

// Lazy load route components to improve initial load performance
const CharacterListPage = lazy(() => import('../pages/CharacterListPage'))
const CharacterDetailPage = lazy(() => import('../pages/CharacterDetailPage'))

/**
 * Root route configuration
 * - Serves as the layout container for all child routes
 * - Renders the <Outlet /> to inject nested routes dynamically
 */
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

/**
 * Index route configuration ("/")
 * - Displays the paginated character list
 * - Accepts and validates a "page" query parameter from the URL
 * - Defaults to page 1 if not provided or invalid
 */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CharacterListPage,
  validateSearch: (search): { page: number } => ({
    page: Number(search.page) || 1,
  }),
})

/**
 * Detail route configuration ("/character/:characterId")
 * - Displays details for a specific character
 * - ":characterId" is a dynamic route segment used to fetch and render character-specific data
 */
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character/$characterId',
  component: CharacterDetailPage,
})

// Define the full route tree by attaching child routes to the root route
const routeTree = rootRoute.addChildren([indexRoute, detailRoute])

/**
 * Create and export the router instance
 * - Used in the application entry point to provide routing context
 */
export const router = createRouter({ routeTree })
