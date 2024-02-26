import React, { useEffect, useState } from "react";
import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import TransactionTrustsModel from "@/components/TransactionTrustsModel";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import NoData from "@/components/NoData";
import { TrustData } from "@/types/types";

const ManageTransaction = () => {
  const access_token = Cookies.get("access_token");
  const [totalCollection, setTotalCollection] = useState();
  const [totalSupporter, setTotalSupporter] = useState();
  const [trustWiseTransaction, setTrustWiseTransaction] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
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
        setTotalSupporter(data.totalSupporters);
        setTrustWiseTransaction(data.Tdata);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData(); // Call the function to fetch data
  }, [access_token]);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <AdminFrame title="Manage Transaction">
      {loading ? (
        <Spinner />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="flex flex-col gap-10">
          {!trustWiseTransaction.length ? (
            <NoData />
          ) : (
            <div className="w-full flex flex-col md:flex-row justify-between items-center bg-gray-100 rounded-lg p-6">
              <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
                <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                  Total Collection
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  ₹{formatAmount(totalCollection)}
                </p>
              </div>
              <div className="w-1/2 border-t border-gray-300 md:border-none my-4 md:my-0"></div>
              <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
                <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                  Total Supporter
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {totalSupporter}
                </p>
              </div>
            </div>
          )}

          {trustWiseTransaction &&
            trustWiseTransaction.length &&
            trustWiseTransaction.map((data: any) => {
              return (
                <TransactionTrustsModel
                  key={data?.tId}
                  title={data?.trustName}
                  description={data?.description}
                  trustImage={data?.trustlogo}
                  founder={data?.founder}
                  creationDate={data?.creationDate}
                  amount={formatAmount(data?.TotalAmount)}
                  onShowTransaction={() => {
                    console.log(data?._id);
                    router.push(`/admin/managetransaction/${data?._id}`);
                  }}
                />
              );
            })}
        </div>
      )}
    </AdminFrame>
  );
};

export default AdminRoute(ManageTransaction);
