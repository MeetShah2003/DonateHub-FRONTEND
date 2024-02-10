import React from "react";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

const AdminRoute = (Component: any) => {
  return ProtectedRoute(Component, ["admin"]);
};

export default AdminRoute;
