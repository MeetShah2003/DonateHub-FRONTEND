import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import UserFrame from "@/components/Visitor";

const Dashboard = () => {
  return <UserFrame />;
};

export const getServerSideProps = getAuthenticatedRouteCheck;
export default Dashboard;
