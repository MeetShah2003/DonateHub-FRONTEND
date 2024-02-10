import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { useAuth } from "@/context/auth";
import React from "react";

const Admin = () => {
  // const { userData } = useUser();
  // console.log("adminUser", userData?.user.username);

  return (
    <AdminFrame title="Dashboard">
      <></>
    </AdminFrame>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default AdminRoute(Admin);
