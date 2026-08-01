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
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4 rounded-[20px] border border-slate-200 bg-slate-50 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Trust Summary</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Total Collection</h2>
                <p className="mt-2 text-3xl font-bold text-primary">₹{formatAmount(transactions.totalDonatedAmount)}</p>
              </div>
              <div className="hidden h-16 w-px bg-slate-200 md:block" />
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <h2 className="text-2xl font-semibold text-slate-900">Total Supporters</h2>
                <p className="mt-2 text-3xl font-bold text-primary">{transactions.totalUniqueSupporters}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
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
                        amount={manualDonatedAmount as number}
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
