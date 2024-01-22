import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import AdminFrame from "@/components/AdminFrame";
import { useUser } from "@/context/user";

const Admin = () => {
  const { userData } = useUser();
  // console.log("adminUser", userData?.user.username);

  return (
    <AdminFrame title="Home">
      <></>
    </AdminFrame>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default Admin;
