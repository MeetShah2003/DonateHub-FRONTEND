import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { BACKEND_BASE_URL } from "@/consts";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import TransactionInfo from "@/components/TransactionInfo";
import NoData from "@/components/NoData";
import { TransctionForAdmin, TransctionsForAdmin } from "@/types/types";
import { toast } from "react-toastify";

const SingleTrustTransaction = () => {
  const [transactions, setTransactions] = useState<TransctionsForAdmin>();
  const access_token = Cookies.get("access_token");
  const { query } = useRouter();

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const getAllTransaction = (id: string) => {
    fetch(`${BACKEND_BASE_URL}/admin/manualTrustTransaction/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log(data);
          setTransactions(data);
        }
      })
      .catch(() => {
        errorToast("Something went wrong");
      });
  };
  useEffect(() => {
    getAllTransaction(query?.id as string);
  }, [access_token]);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <>
      <AdminFrame title="Transactions">
        {!transactions?.myTrust?.length ? (
          <NoData />
        ) : (
          <div>
            <div className="w-full flex flex-col md:flex-row justify-between items-center bg-gray-100 rounded-lg p-6">
              <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
                <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                  Total Collection
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  ₹{formatAmount(transactions.totalDonatedAmount)}
                </p>
              </div>
              <div className="w-1/2 border-t border-gray-300 md:border-none my-4 md:my-0"></div>
              <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
                <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                  Total Supporter
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {transactions.totalUniqueSupporters}
                </p>
              </div>
            </div>
            <div className="flex flex-col mt-2 gap-2">
              {transactions &&
                transactions.myTrust.length &&
                transactions.myTrust.map(
                  ({
                    _id,
                    uId,
                    paymentId,
                    transactionDate,
                    manualDonatedAmount,
                  }) => {
                    return (
                      <TransactionInfo
                        key={_id}
                        transactionDate={transactionDate}
                        amount={formatAmount(manualDonatedAmount)}
                        paymentId={paymentId}
                        userImage={uId?.userlogo}
                        userName={`${uId?.firstName} ${uId?.lastName}`}
                      />
                    );
                  }
                )}
            </div>
          </div>
        )}
      </AdminFrame>
    </>
  );
};

export default AdminRoute(SingleTrustTransaction);
