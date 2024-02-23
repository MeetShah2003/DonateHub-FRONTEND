import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { BACKEND_BASE_URL } from "@/consts";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ProfileIcon from "@/icons/ProfileIcon";
import ManageTrustIcon from "@/icons/ManageTrustIcon";
import { number } from "yup";

const Admin = () => {
  const [totalSuppoters, setTotalSuppoters] = useState<number>();
  const [totalUnverifiedTrusts, setTotalUnverifiedTrusts] = useState<number>();
  const [totalTrusts, setTotalTrusts] = useState<number>();
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
        console.log(data.totalUsers);
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

  useEffect(() => {
    getAllUsersCount();
    getAllTrustCount();
    getAllUnverifedTrustCount();
  }, [totalSuppoters, totalTrusts]);
  return (
    <AdminFrame title="Dashboard">
      <div className="flex flex-col">
        <div className="grid grid-cols-2 justify-between gap-5">
          <div className="flex flex-col py-5 justify-center items-center bg-primary w-full rounded-md text-white">
            <h1 className="font-inter flex items-center justify-center gap-2 font-bold text-2xl">
              <span>
                <ProfileIcon color="#FFFFFF" />
              </span>
              {totalSuppoters}
            </h1>
            <p className="text-base font-medium">Suppoters</p>
          </div>
          <div className="flex flex-col py-5 justify-center items-center bg-secondary w-full rounded-md text-white">
            <h1 className="font-inter flex items-center justify-center gap-2 font-bold text-2xl">
              <span>
                <ManageTrustIcon />
              </span>
              {totalSuppoters}
            </h1>
            <p className="text-base font-medium">Verified Trusts</p>
          </div>
          <div className="flex flex-col py-5 justify-center items-center bg-secondary w-full rounded-md text-white">
            <h1 className="font-inter font-bold text-2xl">
              <span className="font-normal">₹</span> 55555
            </h1>
            <p className="text-base font-medium">Collection</p>
          </div>
          <div className="flex flex-col py-5 justify-center items-center bg-primary w-full rounded-md text-white">
            <h1 className="font-inter flex items-center justify-center gap-2 font-bold text-2xl">
              <span>
                <ManageTrustIcon />
              </span>
              {totalUnverifiedTrusts}
            </h1>
            <p className="text-base font-medium">Unverified Trusts</p>
          </div>
        </div>
        <div></div>
      </div>
    </AdminFrame>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default AdminRoute(Admin);
