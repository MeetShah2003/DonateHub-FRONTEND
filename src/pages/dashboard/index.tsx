import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import AdminRoute from "@/components/AdminRoute";
import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";

const Dashboard = () => {
  return <Visitor />;
};

export const getServerSideProps = getAuthenticatedRouteCheck;
export default UserRoute(Dashboard);
