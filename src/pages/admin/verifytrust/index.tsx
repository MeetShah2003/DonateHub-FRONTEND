import AdminFrame from "@/components/AdminFrame";
import TrustApprovalModal from "@/components/TrustApprovalModal";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { BACKEND_BASE_URL } from "@/consts";

const VerifyTrust = () => {
  const { isAuthenticated, token } = useAuth();
  const [unVerifiedTrusts, setUnVerifiedTrusts] = useState([]);
  const access_token = Cookies.get("access_token");
  const router = useRouter();

  console.log(unVerifiedTrusts);

  const getPendingTrust = async () => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/admin/allTrustsU`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(response);

      const data = await response.json();
      console.log(data["unverifiedTrusts"]);
      setUnVerifiedTrusts(data["unverifiedTrusts"]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getPendingTrust();
  }, [token]);

  return (
    <AdminFrame title="Verify Trust">
      {unVerifiedTrusts &&
        unVerifiedTrusts?.length > 0 &&
        unVerifiedTrusts?.map(({ trustName, description, _id }) => {
          console.log(_id);
          return (
            <div className="my-2">
              <TrustApprovalModal
                description={description}
                title={trustName}
                trustImage={
                  "https://www.pixelstalk.net/wp-content/uploads/2016/07/Wallpapers-pexels-photo.jpg"
                }
                onVerify={() => {
                  router.push(`/admin/verifytrust/${_id}`);
                }}
              />
            </div>
          );
        })}
    </AdminFrame>
  );
};

export default VerifyTrust;
