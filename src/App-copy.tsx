import * as React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import Loader from "./components/Loader";
import { useAuthStore } from "./store/useAuthStore";

// const BlogCategoriesPage = React.lazy(
//   () => import("./pages/blogs/category/blog-categories-page")
// );
// const BlogPage = React.lazy(() => import("./pages/blogs/blogs-page"));
// const ActorsCategoriesPage = React.lazy(
//   () => import("./pages/dealers/category/dealer-categories-page")
// );
// const InputDealersPage = React.lazy(
//   () => import("./pages/dealers/dealers-page")
// );
// const NewsPage = React.lazy(() => import("./pages/news/news-page"));
const DashboardLayout = React.lazy(
  () => import("./components/layout/DashboardLayout")
);
const LoginPage = React.lazy(() => import("./pages/auth/login-page"));
const RegisterPage = React.lazy(() => import("./pages/auth/register-page"));
const ForgotPasswordPage = React.lazy(
  () => import("./pages/auth/forget-password-page")
);
const VerifyEmailPage = React.lazy(
  () => import("./pages/auth/verify-email-page")
);
const ResetPasswordPage = React.lazy(
  () => import("./pages/auth/reset-password-page")
);
const DashboardPage = React.lazy(
  () => import("./pages/dashboard/dashboard-page")
);
const ProfilePage = React.lazy(() => import("./pages/profile/profile-page"));
const EditProfilePage = React.lazy(
  () => import("./pages/profile/edit-profile-page")
);
// const PrivacyPolicyPage = React.lazy(
//   () => import("./pages/content/privacy-policy-page")
// );
const NotFoundPage = React.lazy(() => import("./pages/404"));

function isTokenExpired(token: string) {
  const expiry = JSON.parse(atob(token.split(".")[1])).exp;
  return Math.floor(new Date().getTime() / 1000) >= expiry;
}

function PrivateOutlet() {
  const auth = useAuthStore((state) => state.auth);
  const logout = useAuthStore((state) => state.logout);

  const roles = auth?.user?.roles?.map((it) => it);
  const isAdmin = roles?.includes("admin") || roles?.includes("super-admin");

  if (auth && isTokenExpired(auth.accessToken)) {
    logout();
    return <Navigate to="/login" />;
  }

  if (auth && isAdmin && auth.user?.isEmailVerified) {
    return <Outlet />;
  } else if (auth && !auth.user?.isEmailVerified) {
    return <Navigate to="/verify-email" />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default function App() {
  return (
    <React.Suspense fallback={<Loader className="min-h-screen" />}>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        {/* <Route path="content/privacy-policy" element={<PrivacyPolicyPage />} /> */}

        <Route
          path="/*"
          element={
            <DashboardLayout>
              <PrivateOutlet />
            </DashboardLayout>
          }
        >
          <Route path="" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
          {/* <Route path="blogs/categories" element={<BlogCategoriesPage />} />
          <Route path="blogs" element={<BlogPage />} />
          <Route path="dealers/categories" element={<ActorsCategoriesPage />} />
          <Route path="dealers" element={<InputDealersPage />} />
          <Route path="news" element={<NewsPage />} /> */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </React.Suspense>
  );
}
