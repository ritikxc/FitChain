import { Navigate, useLocation } from 'react-router-dom'
import { getToken, getStoredUser } from '../services/api'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = getToken()
  const user = getStoredUser()

  if (!token || !user) return <Navigate to="/login" replace />
  if (!user.profile?.setupComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return children
}
