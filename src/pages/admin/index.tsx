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
import ReactAreaChart from "@/components/ReactAreaChart";
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

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount || 0);
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
      <div className="flex flex-col gap-6 py-4">
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-primary p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                Admin Overview
              </p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                DonateHub operations at a glance
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                Track supporters, verified trusts, collections, and pending approvals in one professional command center.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-sm text-slate-300">Live collection</p>
              <p className="mt-1 text-2xl font-semibold">₹{formatAmount(totalCollection)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div
            onClick={() => router.push("/admin/manageuser")}
            className="cursor-pointer rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Supporters</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{totalSuppoters}</p>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <ProfileIcon color="#4f46e5" />
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/admin/managetrust")}
            className="cursor-pointer rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Verified Trusts</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{totalTrusts}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <ManageTrustIcon />
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/admin/managetransaction")}
            className="cursor-pointer rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Collection</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">₹{formatAmount(totalCollection)}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                <span className="text-xl font-semibold">₹</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/admin/verifytrust")}
            className="cursor-pointer rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{totalUnverifiedTrusts}</p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
                <ManageTrustIcon />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ReactLineChart data={supporterChartData} title="Supporter Growth" />
          <ReactBarChart data={IncomeChartData} title="Manual Donations" />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ReactAreaChart data={disasterIncomeChartData} title="Disaster Fund Trend" dataKey="income" />
          <ReactAreaChart data={supporterChartData} title="Supporter Activity" dataKey="supporters" />
        </div>
      </div>
    </AdminFrame>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default AdminRoute(Admin);
