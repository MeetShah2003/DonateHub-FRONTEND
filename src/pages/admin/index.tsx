import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import AdminFrame from "@/components/AdminFrame";
import { useUser } from "@/context/user";

const Admin = () => {
  const { userData } = useUser();
  console.log("adminUser", userData?.user.username);

  return (
    <AdminFrame
      title="Home"
      userEmail={userData?.user.email || ""}
      userName={userData?.user.username || ""}
    >
      <></>
    </AdminFrame>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default Admin;
