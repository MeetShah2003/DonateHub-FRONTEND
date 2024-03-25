import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { BACKEND_BASE_URL } from "@/consts";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ProfileIcon from "@/icons/ProfileIcon";
import ManageTrustIcon from "@/icons/ManageTrustIcon";
import { useRouter } from "next/router";
import ReactLineChart from "@/components/ReactLineChart";
import ReactBarChart from "@/components/ReactBarChart.tsx";
import { toast } from "react-toastify";

const Admin = () => {
  const [totalSuppoters, setTotalSuppoters] = useState<number>();
  const [totalUnverifiedTrusts, setTotalUnverifiedTrusts] = useState<number>();
  const [supporterChartData, setSupporterChartData] =
    useState<{ date: string; supporters: number }[]>();
  const [IncomeChartData, setIncomeChartData] =
    useState<{ date: string; totalIncome: number }[]>();
  const [disasterIncomeChartData, setDisasterIncomeChartData] =
    useState<{ date: string; totalIncome: number }[]>();
  const [totalCollection, setTotalCollection] = useState();
  const [totalTrusts, setTotalTrusts] = useState<number>(0);
  const router = useRouter();
  const access_token = Cookies.get("access_token");
  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const getAllUsersCount = () => {
    fetch(`${BACKEND_BASE_URL}/admin/countUser`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalSuppoters(data.totalUsers);
      });
  };

  const getSupporterChartData = () => {
    fetch(`${BACKEND_BASE_URL}/admin/userChart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSupporterChartData(data.formattedData);
      });
  };

  const getIncomeChartData = () => {
    fetch(`${BACKEND_BASE_URL}/admin/trustManualInc`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIncomeChartData(data.totalIncome);
      });
  };

  const getDisasterIncomeChartData = () => {
    fetch(`${BACKEND_BASE_URL}/admin/trustDisasterInc`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDisasterIncomeChartData(data.totalIncome);
      });
  };

  const getAllTrustCount = () => {
    fetch(`${BACKEND_BASE_URL}/admin/countTrust`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalTrusts(data?.totalTrusts);
      });
  };

  const getAllUnverifedTrustCount = () => {
    fetch(`${BACKEND_BASE_URL}/admin/countUnverifiedTrust`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data");
        setTotalUnverifiedTrusts(data?.totalTrusts);
      });
  };

  const getTotalCollection = async () => {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/admin/trustTransaction`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setTotalCollection(data.receiveFund);
    } catch (error: any) {
      errorToast("Something went wrong");
    }
  };

  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  ];

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  useEffect(() => {
    getAllUsersCount();
    getAllTrustCount();
    getAllUnverifedTrustCount();
    getTotalCollection();
    getSupporterChartData();
    getIncomeChartData();
    getDisasterIncomeChartData();
  }, [totalSuppoters, totalTrusts]);
  return (
    <AdminFrame title="Dashboard">
      <div className="flex flex-col gap-5 py-5">
        <div className="grid grid-cols-2 justify-between gap-5">
          <div
            onClick={() => {
              router.push("/admin/manageuser");
            }}
            className="flex flex-col py-5 justify-center hover:scale-105 cursor-pointer hover:transition-all hover:duration-400 hover:ease-out items-center bg-primary w-full rounded-md text-white"
          >
            <h1 className="font-inter flex items-center justify-center gap-2 font-bold text-2xl">
              <span>
                <ProfileIcon color="#FFFFFF" />
              </span>
              {totalSuppoters}
            </h1>
            <p className="text-base font-medium">Suppoters</p>
          </div>
          <div
            onClick={() => {
              router.push("/admin/managetrust");
            }}
            className="flex flex-col py-5 justify-center hover:scale-105 cursor-pointer hover:transition-all hover:duration-400 hover:ease-out items-center bg-secondary w-full rounded-md text-white"
          >
            <h1 className="font-inter flex items-center justify-center gap-2 font-bold text-2xl">
              <span>
                <ManageTrustIcon />
              </span>
              {totalTrusts}
            </h1>
            <p className="text-base font-medium">Verified Trusts</p>
          </div>
          <div
            onClick={() => {
              router.push("/admin/managetransaction");
            }}
            className="flex flex-col py-5 justify-center hover:scale-105 cursor-pointer hover:transition-all hover:duration-400 hover:ease-out items-center bg-secondary w-full rounded-md text-white"
          >
            <h1 className="font-inter font-bold text-2xl">
              <span className="font-normal">₹</span>{" "}
              {formatAmount(totalCollection)}
            </h1>
            <p className="text-base font-medium">Collection</p>
          </div>
          <div
            onClick={() => {
              router.push("/admin/verifytrust");
            }}
            className="flex flex-col py-5 justify-center hover:scale-105 cursor-pointer hover:transition-all hover:duration-400 hover:ease-out items-center bg-primary w-full rounded-md text-white"
          >
            <h1 className="font-inter flex items-center justify-center gap-2 font-bold text-2xl">
              <span>
                <ManageTrustIcon />
              </span>
              {totalUnverifiedTrusts}
            </h1>
            <p className="text-base font-medium">Unverified Trusts</p>
          </div>
        </div>
        <div>
          <h1 className="sm:block py-5 font-inter font-semibold text-steelGray text-xl sm:text-2xl">
            Analytics
          </h1>
        </div>
        <div className="flex flex-col md:flex-row -z-10 gap-5">
          <ReactLineChart data={supporterChartData} title="Supporter Chart" />
          <ReactBarChart data={IncomeChartData} title="Income Chart" />
        </div>
        <div className="flex flex-col md:flex-row -z-10 gap-5">
          <ReactBarChart
            data={disasterIncomeChartData}
            title="Disaster Income Chart"
          />
        </div>
      </div>
    </AdminFrame>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default AdminRoute(Admin);
