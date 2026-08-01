import Receipt from "@/components/Receipt";
import ReceiptForDisaster from "@/components/ReceiptForDisaster";
import ReceiptForTrust from "@/components/ReceiptForTrust";
import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";
import { BACKEND_BASE_URL } from "@/consts";
import { useAuth } from "@/context/auth";
import {
  SingleDisasterTransactionDetails,
  SingleTrustTransactionDetails,
  SuccessTransaction,
} from "@/types/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { access } from "fs";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SingleTrustTransactions = () => {
  const { user } = useAuth();
  const { query, push } = useRouter();
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [successTransactionData, setSuccessTransactionData] =
    useState<SingleTrustTransactionDetails>();

  //   const getDataFromCookie = () => {
  //     const cookieSuccessTransaction = Cookies.get("successTransaction");
  //     const successTransaction: SuccessTransaction = cookieSuccessTransaction
  //       ? JSON.parse(cookieSuccessTransaction)
  //       : null;

  //     if (successTransaction) {
  //       setSuccessTransactionData(successTransaction);
  //     }
  //   };

  const getSingleTransactionData = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/api/singleManualTran/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data.singleTran);
        if (data.singleTran) {
          setSuccessTransactionData(data.singleTran);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getSingleTransactionData(query.id as string);
  }, []);

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <>
      <div className="navbar sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      <div className="mx-auto max-w-5xl w-[90%] py-8 md:py-10">
        <div className="mb-6 rounded-[30px] bg-gradient-to-r from-violet-700 via-primary to-fuchsia-600 p-[1px] shadow-[0_25px_70px_-30px_rgba(109,40,217,0.7)]">
          <div className="rounded-[29px] bg-white/95 px-5 py-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Payment detail
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">Transaction Detail</h1>
              </div>
              <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-primary">
                {successTransactionData?.paymentId ? "Success" : "Failed"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Campaign Name", successTransactionData?.tId?.trustName],
              ["Transaction ID", successTransactionData?.paymentId],
              ["Amount", `₹ ${formatAmount(successTransactionData?.manualDonatedAmount)}`],
              ["Donator Name", `${user?.firstName} ${user?.lastName}`],
              ["Transaction Date", successTransactionData?.transactionDate.toString()],
              ["Status", successTransactionData?.paymentId ? "Success" : "Failed"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{value || "—"}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[22px] bg-primary px-4 py-3 text-center text-white shadow-sm">
            <PDFDownloadLink
              document={
                <ReceiptForTrust
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  transactionData={successTransactionData}
                />
              }
              fileName="receipt.pdf"
              onClick={() => {
                push(`/dashboard`);
                Cookies.remove("successTransaction");
                successToast("Receipt Downloaded");
              }}
            >
              {({ loading }) =>
                loading ? "Loading document..." : "Download Receipt"
              }
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRoute(SingleTrustTransactions);
