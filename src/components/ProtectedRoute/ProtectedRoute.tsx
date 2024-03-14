import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/auth";

const ProtectedRoute = (Component: any, allowedRoles: any) => {
  const ProtectedRouteWrapper = (props: any) => {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user && allowedRoles && !allowedRoles.includes(user?.role)) {
        if (user?.role === "admin") {
          router.push("/admin");
        } else if (user?.role === "trust") {
          router.push("/trust");
        } else {
          router.push("/dashboard");
        }
      }
    }, [isAuthenticated, user, router]);

    return isAuthenticated &&
      user &&
      allowedRoles &&
      allowedRoles.includes(user?.role) ? (
      <Component {...props} />
    ) : null;
  };

  return ProtectedRouteWrapper;
};

export default ProtectedRoute;
