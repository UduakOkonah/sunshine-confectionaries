import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;