import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { checkTokenExpired } from "./lib/utils";
import { useAuthStore } from "./store/useAuthStore";

// Define a safe fallback path for non-admins trying to access admin routes
const FALLBACK_PATH_FOR_NON_ADMIN = "/unauthorized"; // Or '/profile', or another safe route

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  requireEmailVerified?: boolean;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAdmin = true,
  requireEmailVerified = true,
  children,
}) => {
  const location = useLocation();

  const auth = useAuthStore((state) => state.auth);
  const logout = useAuthStore((state) => state.logout);

  const isAuthenticated = !!auth?.user;

  const isAdmin =
    auth?.user?.roles?.includes("admin") ||
    auth?.user?.roles?.includes("super-admin");
  const isTokenExpired = checkTokenExpired(auth?.accessToken);
  const isEmailVerified = auth?.user?.isEmailVerified;

  // Now rely on the selector which also checks expiry internally
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Explicit check for immediate logout on expiry, even before other checks.
  // This prevents hitting verification/admin checks with an already expired token.
  if (auth?.accessToken && isTokenExpired) {
    console.warn("ProtectedRoute: Token expired, logging out.");
    logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireEmailVerified && !isEmailVerified) {
    console.log(
      "ProtectedRoute: Email not verified, redirecting to verify-email."
    );
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.warn(
      `ProtectedRoute: Admin privileges required for ${location.pathname}, redirecting.`
    );
    // *** FIXED: Redirect to a safe fallback path, NOT the original path ***
    return <Navigate to={FALLBACK_PATH_FOR_NON_ADMIN} replace />;
  }

  // All checks passed
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
