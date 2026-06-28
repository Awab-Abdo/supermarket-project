import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  if (loading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
