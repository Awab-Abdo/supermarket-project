import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, token } = useAuth()

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />
  }

  if (!user.isAdmin) {
    return <Navigate to="/home" replace />
  }

  return children
}

export default AdminRoute
