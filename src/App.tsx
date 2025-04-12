import * as React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import Loader from "./components/Loader";
import ProtectedRoute from "./ProtectedRoute";
import PublicAuthRoute from "./PublicAuthRoute";

const DashboardLayout = React.lazy(() => import("./components/layout/DashboardLayout"));
const LoginPage = React.lazy(() => import("./pages/auth/login-page"));
const RegisterPage = React.lazy(() => import("./pages/auth/register-page"));
const ForgotPasswordPage = React.lazy(() => import("./pages/auth/forget-password-page"));
const VerifyEmailPage = React.lazy(() => import("./pages/auth/verify-email-page"));
const ResetPasswordPage = React.lazy(() => import("./pages/auth/reset-password-page"));
const DashboardPage = React.lazy(() => import("./pages/dashboard/dashboard-page"));
const ProfilePage = React.lazy(() => import("./pages/profile/profile-page"));
const EditProfilePage = React.lazy(() => import("./pages/profile/edit-profile-page"));
const NotFoundPage = React.lazy(() => import("./pages/404"));
const UnauthorizedPage = React.lazy(() => import("./pages/UnauthorizedPage"));

export default function App() {
  return (
    <React.Suspense fallback={<Loader className="min-h-screen" />}>
      <Routes>
        {/* --- Authentication Routes --- */}
        {/* Wrap with PublicAuthRoute to redirect if already logged in */}
        <Route element={<PublicAuthRoute />}>
        {/* <Route element={<AuthLayout />}> Optional layout wrapper */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* </Route> */}
        </Route>

        {/* Email verification is special: User might be "logged in" but needs verification */}
        {/* This route likely needs access even if not fully "authorized" for admin tasks yet */}
        {/* Let's assume it requires being logged in but not necessarily verified or admin */}
        {/* Adjust ProtectedRoute props if needed */}
        <Route path="/verify-email" element={
            <ProtectedRoute requireAdmin={false} requireEmailVerified={false}>
                 <VerifyEmailPage />
            </ProtectedRoute>
        }/>

        {/* --- Protected Routes (Require Auth, Email Verification, Admin Role) --- */}
        <Route
          element={
            // Protect the entire group of routes
            <ProtectedRoute requireAdmin={true} requireEmailVerified={true}>
              <DashboardLayout> {/* Apply layout only to protected routes */}
                <Outlet /> {/* Child routes will render here */}
              </DashboardLayout>
            </ProtectedRoute>
          }
        >
          {/* Routes relative to the parent ('/') because parent path is "/" implicitly */}
          <Route path="/" element={<DashboardPage />} /> {/* Root protected route */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} /> {/* Optional redirect */}

          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />

          {/* Catch-all inside protected area - maybe redundant if DashboardLayout has its own 404 */}
           <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* --- Route for unauthorized access --- */}
        {/* This route should be accessible even if logged in but not admin */}
        <Route
          path="/unauthorized"
          element={
            // Protect basic login status maybe, but not admin/email
            <ProtectedRoute requireAdmin={false} requireEmailVerified={false}>
              <UnauthorizedPage />
            </ProtectedRoute>
          }
        />

        {/* --- Public Routes --- */}
        {/* <Route path="/content/privacy-policy" element={<PrivacyPolicyPage />} /> */}


        {/* --- Global Catch-all for 404 Not Found --- */}
        {/* This should be the last route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </React.Suspense>
  );
}
