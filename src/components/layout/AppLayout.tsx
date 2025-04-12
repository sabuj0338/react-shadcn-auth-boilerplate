import { useAuthStore } from "@/store/useAuthStore";
import * as React from "react";
import { Navigate } from "react-router";

const Navbar = React.lazy(() => import("./Navbar"));

type Props = {
  children?: React.ReactNode;
}

export default function AppLayout(props: Props) {
  const { children } = props;
  const auth = useAuthStore((state) => state.auth);

  if (auth === undefined) {
    return <Navigate replace to="/login" />;
  }

  return (
    <>
      <React.Suspense fallback={<>loading...</>}>
        <Navbar />
      </React.Suspense>

      <main className="container max-w-4xl mx-auto px-4 md:px-6 py-3">{children}</main>
    </>
  );
}
