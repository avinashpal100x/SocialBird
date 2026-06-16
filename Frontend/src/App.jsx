import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import HomePage from './pages/HomePage'
import LayoutPage from './pages/LayoutPage'
import ProfilePage from './pages/ProfilePage'
import Signup from './pages/AuthPage/SignupPage'
import Login from './pages/AuthPage/LoginPage'



const browserRouter = createBrowserRouter([

  {
    path: '/',
    element: <LayoutPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'profile', element: <ProfilePage /> }
    ]
  },

  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> }
  
])

function App() {
  return <RouterProvider router={browserRouter} />
}

export default App