import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

const TrustRoute = (Component: any) => {
  return ProtectedRoute(Component, ["trust"]);
};

export default TrustRoute;
