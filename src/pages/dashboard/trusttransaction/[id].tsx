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
      <div className="max-w-4xl mx-auto px-5 w-full py-10 flex flex-col gap-5">
        <h1 className="my-5 text-2xl font-semibold">Transaction Detail</h1>
        <table className="border-collapse w-full border">
          <tbody>
            <tr>
              <td className="border border-gray-400 font-bold px-4 py-2">
                campaign name
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {successTransactionData?.tId?.trustName}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 font-bold px-4 py-2">
                transaction id
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {successTransactionData?.paymentId}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 font-bold px-4 py-2">
                amount
              </td>
              <td className="border border-gray-400 px-4 py-2">
                ₹ {formatAmount(successTransactionData?.manualDonatedAmount)}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 font-bold px-4 py-2">
                donator Name
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {user?.firstName} {user?.lastName}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 font-bold px-4 py-2">
                transaction date
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {successTransactionData?.transactionDate.toString()}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 font-bold px-4 py-2">
                status
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {successTransactionData?.paymentId ? "Success" : "Failed"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* <div className="flex flex-col border-2 mt-2 bg-primary shadow-sm rounded-lg px-2 py-2">
          <button
            type="button"
            className="outline-none text-white font-inter font-medium"
          >
            Download Receipt
          </button>
        </div> */}
        <div className="flex flex-col border-2 mt-2 bg-primary text-white items-center shadow-sm rounded-lg px-2 py-2">
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
    </>
  );
};

export default UserRoute(SingleTrustTransactions);
