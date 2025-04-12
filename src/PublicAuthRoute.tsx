import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from './store/useAuthStore';

const PublicAuthRoute: React.FC = () => {
  const auth = useAuthStore((state) => state.auth);

  if (auth) {
    // Redirect logged-in users away from auth pages (e.g., to dashboard)
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Render children (Login, Register pages)
};

export default PublicAuthRoute;