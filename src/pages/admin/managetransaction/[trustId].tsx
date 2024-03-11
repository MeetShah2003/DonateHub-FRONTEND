import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { BACKEND_BASE_URL } from "@/consts";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import TransactionInfo from "@/components/TransactionInfo";
import NoData from "@/components/NoData";
import { SingleTrustTransaction } from "@/types/types";

const SingleTrustTransaction = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<SingleTrustTransaction[]>();
  const [totalCollection, setTotalCollection] = useState();
  const [totalSupporter, setTotalSupporter] = useState();
  const access_token = Cookies.get("access_token");

  const totalCollectionFinder = (transactions: SingleTrustTransaction[]) => {
    if (!transactions || transactions.length === 0) {
      console.log("No transactions available");
      return 0;
    }

    const totalCollection = transactions.reduce((total, { donatedAmount }) => {
      return total + donatedAmount;
    }, 0);

    console.log("Total Collection:", totalCollection);
    return totalCollection;
  };

  const getAllTransaction = (id: string) => {
    fetch(`${BACKEND_BASE_URL}/admin/singleTrustTransaction/${id}`, {
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
          setTotalSupporter(data.totalSupporters);
          setTransactions(data.myTrust);
        }
      });
  };
  useEffect(() => {
    getAllTransaction(router?.query?.trustId as string);
  }, [access_token]);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <>
      <AdminFrame title="Transactions">
        {!transactions?.length ? (
          <NoData />
        ) : (
          <div>
            <div className="w-full flex flex-col md:flex-row justify-between items-center bg-gray-100 rounded-lg p-6">
              <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
                <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                  Total Collection
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  ₹
                  {formatAmount(
                    totalCollectionFinder(
                      transactions as SingleTrustTransaction[]
                    )
                  )}
                </p>
              </div>
              <div className="w-1/2 border-t border-gray-300 md:border-none my-4 md:my-0"></div>
              <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
                <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                  Total Supporter
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {2}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {transactions &&
                transactions.length &&
                transactions.map(
                  ({ _id, uId, paymentId, donatedAmount, transactionDate }) => {
                    return (
                      <TransactionInfo
                        key={_id}
                        transactionDate={transactionDate}
                        amount={formatAmount(donatedAmount)}
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
