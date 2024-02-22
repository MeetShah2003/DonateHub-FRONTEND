import AdminRoute from "@/components/AdminRoute";
import { useRouter } from "next/router";

const SingleTrustTransaction = () => {
  const router = useRouter();
  return <div>{router.query.trustId}</div>;
};

export default AdminRoute(SingleTrustTransaction);
