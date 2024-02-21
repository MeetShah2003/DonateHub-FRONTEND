import React, { useEffect, useState } from "react";
import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import TrustApprovalModal from "@/components/TrustApprovalModal";
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

  useEffect(() => {
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
        setTrustWiseTransaction(data.allTrusts);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    getTrustByTransactions();
  }, [access_token]);

  console.log(trustWiseTransaction);

  return (
    <AdminFrame title="Manage Transaction">
      {loading ? (
        <Spinner />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="flex flex-col gap-2">
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
                  amount="2154c"
                  onShowTransaction={() => {
                    console.log(data?._id);
                    router.push(`/admin/managetransaction/${data?._id}`);
                  }}
                />
              );
            })}
          {/* {trustWiseTransaction.map((data: any) => (
            <TransactionTrustsModel
              key={data?.tId}
              title={data?.tId.trustName}
              description={data?.tId.description}
              trustImage={data?.tId.trustlogo}
              founder={data?.tId.founder}
              creationDate={data?.tId.creationDate}
              amount={data?.amount}
              onShowTransaction={() => {
                console.log(data?.tId._id);
                router.push(`/admin/managetransaction/${data?.tId._id}`);
              }}
            />
          ))} */}
        </div>
      )}
    </AdminFrame>
  );
};

export default AdminRoute(ManageTransaction);
