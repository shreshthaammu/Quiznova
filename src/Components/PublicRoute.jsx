import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function PublicRoute({ children }) {
  if (getCurrentUser()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
