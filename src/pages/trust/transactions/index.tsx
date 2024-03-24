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
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-5">
          <div
            onClick={() => {
              // router.push("/admin/manageuser");
            }}
            className="flex flex-col py-5 justify-center hover:scale-105 cursor-pointer hover:transition-all hover:duration-400 hover:ease-out items-center bg-primary w-full rounded-md text-white"
          >
            <h1 className="font-inter flex items-center justify-center gap-2 font-bold text-2xl">
              <span>
                <ProfileIcon color="#FFFFFF" />
              </span>
              {transactions?.uniqueSupporters}
            </h1>
            <p className="text-base font-medium">Suppoters</p>
          </div>

          <div className="flex flex-col py-5 justify-center hover:scale-105 cursor-pointer hover:transition-all hover:duration-400 hover:ease-out items-center bg-secondary w-full rounded-md text-white">
            <h1 className="font-inter font-bold text-2xl">
              <span className="font-normal">₹</span>{" "}
              {formatAmount(transactions?.myIncome)}
            </h1>
            <p className="text-base font-medium">Collection</p>
          </div>
        </div>
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
                  className="w-full bg-white rounded-lg shadow-md border p-4"
                >
                  <div className="flex  md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <Image
                            className="h-7 w-7 rounded-full"
                            src={uId?.userlogo}
                            alt="User avatar"
                            height={200}
                            width={300}
                          />
                          <p className="text-black text-sm">
                            {uId.firstName} {uId.lastName}
                          </p>
                        </div>
                        <p className="text-gray-500 text-sm mt-2 md:mt-5">
                          {paymentId}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-right">
                      <h2 className="text-lg font-semibold mb-2">Amount</h2>
                      <p className="text-xl font-normal text-green-600">
                        + ₹ {manualDonatedAmount}
                      </p>
                      <p className="text-sm hidden md:block text-gray-500">
                        {transactionDate.toString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
      </div>
    </TrustNavbar>
  );
};

export default TrustRoute(Transactions);
