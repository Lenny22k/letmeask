import React from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import { Home } from './pages/Home.js'
import { NewRoom } from './pages/NewRoom.js'

import './services/firebase'
import './styles/global.scss'
import { AuthContextProvider } from './context/Auth.js'
import { Room } from './pages/Room.js'
import { AdminRoom } from './pages/AdminRoom.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/rooms/new',
    element: <NewRoom />
  },
  {
    path: '/rooms/:id',
    element: <Room />
  },
  {
    path: '/admin/rooms/:id',
    element: <AdminRoom />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
)
