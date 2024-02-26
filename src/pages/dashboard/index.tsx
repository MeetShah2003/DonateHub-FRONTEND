import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import TrustModel from "@/components/TrustModel";
import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";
import { BACKEND_BASE_URL } from "@/consts";
import { FundRequirement, TrustData } from "@/types/types";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const access_token = Cookies.get("access_token");
  const [fundRequirement, setFundRequirement] = useState<FundRequirement[]>();
  const getAllTrust = async () => {
    fetch(`${BACKEND_BASE_URL}/api/fundRequest`, {
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
        setFundRequirement(data.fundRequirement);
      });
  };

  useEffect(() => {
    getAllTrust();
  }, []);
  return (
    <>
      <Visitor />
      <div className="max-w-screen-lg w-90% mx-auto">
        <h1 className="my-5 text-2xl font-semibold">Home Page</h1>
        <div className="grid grid-cols-1 mx-5 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-center items-center">
          {fundRequirement &&
            fundRequirement.length &&
            fundRequirement.map(({ tId, _id, targetFund, title }) => {
              return (
                <TrustModel
                  key={_id}
                  title={title}
                  trustlogo={tId.trustlogo}
                  trustId={_id}
                  donationRaised={tId.TotalAmount}
                  donationTarget={targetFund}
                  supporters={502}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;
export default UserRoute(Dashboard);
