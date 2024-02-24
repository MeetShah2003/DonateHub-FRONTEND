import React, { useEffect, useState } from "react";
import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import TransactionTrustsModel from "@/components/TransactionTrustsModel";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";

const ManageTransaction = () => {
  const access_token = Cookies.get("access_token");
  const [trustWiseTransaction, setTrustWiseTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const getTrustByTransactions = async () => {
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
      setTrustWiseTransaction(data.Tdata);
      setLoading(false);
    } catch (error: any) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrustByTransactions();
  }, [access_token]);

  return (
    <AdminFrame title="Manage Transaction">
      {loading ? (
        <Spinner />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="w-full flex flex-col md:flex-row justify-between items-center bg-gray-100 rounded-lg p-6">
            <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
              <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                Total Collection
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-primary">
                ₹5000
              </p>
            </div>
            <div className="w-1/2 border-t border-gray-300 md:border-none my-4 md:my-0"></div>
            <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
              <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                Total Supporter
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-primary">5</p>
            </div>
          </div>

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
                  amount={data?.TotalAmount}
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
