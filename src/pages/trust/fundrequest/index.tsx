import FundRequestsModel from "@/components/FundRequestsModel";
import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { BACKEND_BASE_URL } from "@/consts";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { RequestFunds } from "@/types/types";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";

const FundRequests = () => {
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [fundRequests, setFundRequests] = useState<RequestFunds[]>();

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const getRequestData = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/fundReq`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setFundRequests(data.allMyReq);
      })
      .catch((error) => {
        errorToast("Something Went Wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getRequestData();
  }, []);

  return (
    <div>
      {loading && <Spinner />}
      <div className="navbar sticky top-0 bg-white z-10">
        <TrustNavbar />
      </div>
      <div className="max-w-screen-lg w-90% mx-auto">
        <h1 className="my-5 text-2xl font-semibold">Fund Requests</h1>
        {fundRequests &&
          fundRequests.length &&
          fundRequests.map((data) => {
            return <FundRequestsModel data={data} />;
          })}
      </div>
    </div>
  );
};

export default TrustRoute(FundRequests);
