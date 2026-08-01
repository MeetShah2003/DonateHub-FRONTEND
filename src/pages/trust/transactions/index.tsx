import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { BACKEND_BASE_URL } from "@/consts";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { NormalTransactionForTrust } from "@/types/types";
import Image from "next/image";
import ProfileIcon from "@/icons/ProfileIcon";

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<NormalTransactionForTrust>();
  const access_token = Cookies.get("access_token");

  const getTransactions = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/myManualIncome`, {
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
        setTransactions(data);
      });
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <TrustNavbar title="Transactions">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center rounded-[28px] bg-gradient-to-br from-primary to-violet-700 p-6 text-white shadow-[0_20px_55px_-30px_rgba(109,40,217,0.8)]">
            <h1 className="flex items-center justify-center gap-2 text-3xl font-bold">
              <span>
                <ProfileIcon color="#FFFFFF" />
              </span>
              {transactions?.uniqueSupporters}
            </h1>
            <p className="mt-2 text-base font-medium">Supporters</p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-[0_20px_55px_-30px_rgba(15,23,42,0.9)]">
            <h1 className="text-3xl font-bold">
              <span className="font-normal">₹</span>{" "}
              {formatAmount(transactions?.myIncome)}
            </h1>
            <p className="mt-2 text-base font-medium">Collection</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4">
            {transactions?.myTransactions &&
              transactions.myTransactions.length &&
              transactions.myTransactions.map(
                (
                  { manualDonatedAmount, paymentId, transactionDate, uId },
                  index
                ) => {
                  return (
                    <div
                      key={index}
                      className="w-full rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex items-center gap-3">
                          <Image
                            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                            src={uId?.userlogo}
                            alt="User avatar"
                            height={200}
                            width={300}
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {uId.firstName} {uId.lastName}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {paymentId}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start text-left md:items-end md:text-right">
                          <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Amount
                          </h2>
                          <p className="text-xl font-semibold text-green-600">
                            + ₹ {manualDonatedAmount}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 md:block">
                            {transactionDate.toString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      </div>
    </TrustNavbar>
  );
};

export default TrustRoute(Transactions);
