import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentUser, getToken, getStoredUser } from '../services/api'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = getToken()
  const [user, setUser] = useState(() => getStoredUser())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let active = true
    if (!token) return

    getCurrentUser()
      .then((freshUser) => {
        if (active) {
          setUser(freshUser)
          setHydrated(true)
        }
      })
      .catch(() => {
        if (active) {
          setUser(null)
          setHydrated(true)
        }
      })

    return () => {
      active = false
    }
  }, [token])

  if (!token) return <Navigate to="/login" replace />
  if (!hydrated) return null
  if (!user) return <Navigate to="/login" replace />

  const completed = user?.profile?.profileCompleted ?? user?.profile?.setupComplete ?? false
  if (!completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return children
}
