import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import Visitor from "@/components/Visitor";
import { BACKEND_BASE_URL } from "@/consts";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import TransactionInfo from "@/components/TransactionInfo";
import NoData from "@/components/NoData";

const SingleTrustTransaction = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<{}[]>();
  const access_token = Cookies.get("access_token");
  // router.query.trustId

  const getAllTransaction = (id: string) => {
    fetch(`${BACKEND_BASE_URL}/admin/singleTrustTransaction/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          console.log(data.allTransactions);
          console.log(data.allTransactions);
          setTransactions(data.allTransactions);
        }
      });
  };
  useEffect(() => {
    getAllTransaction(router.query.trustId);
  }, [access_token]);

  return (
    <>
      <AdminFrame title="Transactions">
        {!transactions?.length && <NoData />}
        <div className="flex flex-col gap-2">
          {transactions &&
            transactions.length &&
            transactions.map(({ _id, uId, amount }) => {
              return (
                <TransactionInfo
                  key={_id}
                  transactionDate="12/12/2004"
                  amount={amount}
                  paymentId="pay_hkjjnjhbh"
                  userImage={uId?.userlogo}
                  userName={`${uId?.firstName} ${uId?.lastName}`}
                />
              );
            })}
        </div>
      </AdminFrame>
    </>
  );
};

export default AdminRoute(SingleTrustTransaction);
