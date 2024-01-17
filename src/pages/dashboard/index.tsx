import { getAuthenticatedRouteCheck } from "@/authguard/authguard";

const Dashboard = () => {
  return <h2>Hi</h2>;
};

export const getServerSideProps = getAuthenticatedRouteCheck;
export default Dashboard;
