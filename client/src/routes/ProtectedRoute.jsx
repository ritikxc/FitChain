import { Navigate } from 'react-router-dom'
import { getToken, getStoredUser } from '../services/api'

export default function ProtectedRoute({ children }) {
  // Quick client-side check — token + cached user must both exist
  const token = getToken()
  const user = getStoredUser()
  if (!token || !user) return <Navigate to="/login" replace />
  return children
}
