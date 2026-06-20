import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useSelector } from 'react-redux'

import HomePage from './pages/HomePage'
import LayoutPage from './pages/LayoutPage'
import ProfilePage from './pages/ProfilePage'
import Signup from './pages/AuthPage/SignupPage'
import Login from './pages/AuthPage/LoginPage'
import EditProfile from './pages/EditProfilePage'
import ChatPage from './pages/ChatPage'
import { useSocket } from './hooks/useSocket.js'
import NotificationsPage from './pages/NotificationsPage'
import ProtectedRoutes from './components/routesProtection/ProtectedRoutes'



const browserRouter = createBrowserRouter([

  {
    path: '/',
    element: <ProtectedRoutes><LayoutPage /></ProtectedRoutes>,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'profile/:id', element: <ProfilePage /> }
    ]
  },

  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },

  { path: '/profile/edit', element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> },
  { path: '/chat', element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> },
  { path: '/notifications/:id', element: <ProtectedRoutes><NotificationsPage /></ProtectedRoutes> },

])

function App() {

  // socket connection
  const { user } = useSelector(state => state.auth);
  useSocket(user?._id);

  return <RouterProvider router={browserRouter} />
}

export default App