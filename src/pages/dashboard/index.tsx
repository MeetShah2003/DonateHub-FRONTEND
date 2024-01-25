import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import Visitor from "@/components/Visitor";

const Dashboard = () => {
  return <Visitor />;
};

export const getServerSideProps = getAuthenticatedRouteCheck;
export default Dashboard;
