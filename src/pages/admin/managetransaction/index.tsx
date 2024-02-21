import React, { useEffect, useState } from "react";
import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import TrustApprovalModal from "@/components/TrustApprovalModal";
import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import TransactionTrustsModel from "@/components/TransactionTrustsModel";
import Spinner from "@/components/Spinner";

const ManageTransaction = () => {
  const access_token = Cookies.get("access_token");
  const [trustWiseTransaction, setTrustWiseTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setTrustWiseTransaction(data.allTrust);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getTrustByTransactions();
  }, [access_token]);

  return (
    <AdminFrame title="Manage Transaction">
      {loading ? (
        <Spinner />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        trustWiseTransaction.map((data) => (
          <TransactionTrustsModel
            key={data.tId}
            title={data.tId.trustName}
            description={"Test"}
            trustImage={
              "https://firebasestorage.googleapis.com/v0/b/donatehub-d09f5.appspot.com/o/trust_logos%2F11325a42-3455-4974-bc4d-eb667fceb597?alt=media&token=29042ef1-0fd0-47bd-8570-94c91e14be36"
            }
            founder={"Test"}
            creationDate={"Test"}
            amount="5000"
          />
        ))
      )}
    </AdminFrame>
  );
};

export default AdminRoute(ManageTransaction);
