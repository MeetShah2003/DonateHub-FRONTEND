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

const Admin = () => {
  const [totalSuppoters, setTotalSuppoters] = useState<number>();
  const [totalUnverifiedTrusts, setTotalUnverifiedTrusts] = useState<number>();
  const [supporterChartData, setSupporterChartData] =
    useState<{ date: string; supporters: number }[]>();
  const [totalCollection, setTotalCollection] = useState();
  const [totalTrusts, setTotalTrusts] = useState<number>();
  const router = useRouter();
  const access_token = Cookies.get("access_token");
  const getAllUsersCount = () => {
    fetch(`${BACKEND_BASE_URL}/admin/countUser`, {
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
        setTotalSuppoters(data.totalUsers);
      });
  };

  const getSupporterChartData = () => {
    fetch(`${BACKEND_BASE_URL}/admin/userChart`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
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
        setSupporterChartData(data.formattedData);
        console.log(data);
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
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
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
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
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
      console.log(data);
      setTotalCollection(data.TotalAmount);
    } catch (error: any) {
      console.log(error);
    }
  };

  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    // Add more data points as needed
  ];

  useEffect(() => {
    getAllUsersCount();
    getAllTrustCount();
    getAllUnverifedTrustCount();
    getTotalCollection();
    getSupporterChartData();
  }, [totalSuppoters, totalTrusts]);

  const suppoters = [
    { name: "12 jan", suppoters: 2400, amt: 2400 },
    { name: "13 jan", suppoters: 1398, amt: 2210 },
    { name: "14 jan", suppoters: 9800, amt: 2290 },
    { name: "15 jan", suppoters: 3908, amt: 2000 },
    { name: "16 jan", suppoters: 4800, amt: 2181 },
    { name: "17 jan", suppoters: 3800, amt: 2500 },
    { name: "18 jan", suppoters: 4300, amt: 2100 },
  ];
  const income = [
    { name: "12 jan", income: 2400, amt: 2400 },
    { name: "13 jan", income: 1398, amt: 2210 },
    { name: "14 jan", income: 9800, amt: 2290 },
    { name: "15 jan", income: 3908, amt: 2000 },
    { name: "16 jan", income: 4800, amt: 2181 },
    { name: "17 jan", income: 3800, amt: 2500 },
    { name: "18 jan", income: 4300, amt: 2100 },
  ];
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
              <span className="font-normal">₹</span> {totalCollection}
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
        <div className="flex gap-5">
          <ReactLineChart data={supporterChartData} />
          <ReactBarChart data={income} />
        </div>
      </div>
    </AdminFrame>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default AdminRoute(Admin);
