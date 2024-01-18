import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import AdminFrame from "@/components/AdminFrame";

const Admin = () => {
  return <AdminFrame />;
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default Admin;
