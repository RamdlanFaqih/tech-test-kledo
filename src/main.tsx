import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FilterPage from './App.tsx'
import { loader } from './loader'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    path: '/',
    element: <FilterPage />,
    loader
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
