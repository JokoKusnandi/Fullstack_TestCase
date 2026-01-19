import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/Loader";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean; // ✅ TAMBAHKAN INI
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen text="Loading..." />;
  }

  if (!user || !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
