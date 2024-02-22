import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

const UserRoute = (Component: any) => {
  return ProtectedRoute(Component, ["user"]);
};

export default UserRoute;
