import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  if (loading) {
    return null;
  }

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
