import AdminFrame from "@/components/AdminFrame";
import TrustApprovalModal from "@/components/TrustApprovalModal";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { BACKEND_BASE_URL } from "@/consts";
import NoData from "@/components/NoData";

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
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(unVerifiedTrusts);

      const data = await response.json();
      console.log(data["unverifiedTrusts"]);
      setUnVerifiedTrusts(data["unverifiedTrusts"]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(unVerifiedTrusts);

  useEffect(() => {
    getPendingTrust();
  }, [access_token]);

  return (
    <AdminFrame title="Verify Trust">
      {unVerifiedTrusts &&
        unVerifiedTrusts?.length > 0 &&
        unVerifiedTrusts?.map(
          ({
            trustName,
            description,
            _id,
            trustlogo,
            founder,
            creationDate,
          }) => {
            const date = new Date(creationDate);
            const formattedDate = date.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            return (
              <div className="my-2">
                <TrustApprovalModal
                  description={description}
                  title={trustName}
                  creationDate={formattedDate}
                  founder={founder}
                  trustImage={trustlogo}
                  onVerify={() => {
                    router.push(`/admin/verifytrust/${_id}`);
                  }}
                />
              </div>
            );
          }
        )}
      {unVerifiedTrusts?.length <= 0 && <NoData />}
    </AdminFrame>
  );
};

export default VerifyTrust;
