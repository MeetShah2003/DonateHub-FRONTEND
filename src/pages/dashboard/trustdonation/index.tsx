import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import TrustDonationModel from "@/components/TrustDonationModel";
import TrustModel from "@/components/TrustModel";
import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";
import { BACKEND_BASE_URL } from "@/consts";
import { TrustData } from "@/types/types";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const TrustDonation = () => {
  const access_token = Cookies.get("access_token");
  const [trusts, setTrusts] = useState<TrustData[]>();
  const getAllTrust = async () => {
    fetch(`${BACKEND_BASE_URL}/api/allTrustsV`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res: any) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setTrusts(data.verifiedTrusts);
      });
  };

  useEffect(() => {
    getAllTrust();
  }, []);
  return (
    <>
      <Visitor />
      <div className="max-w-screen-lg w-90% mx-auto">
        <h1 className="my-5 text-2xl font-semibold">Trust Donation</h1>
        <div className="flex flex-col gap-5 justify-center items-center">
          {trusts &&
            trusts.length &&
            trusts.map((trust) => {
              return (
                // <TrustModel
                //   key={_id as string}
                //   title={trustName}
                //   trustlogo={trustlogo}
                //   trustId={_id as string}
                //   type="trust"
                //   supporters={502}
                //   description={description}
                // />
                <TrustDonationModel trust={trust} />
              );
            })}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;
export default UserRoute(TrustDonation);
