import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BACKEND_BASE_URL } from "@/consts";
import { SingleTrustTransactions } from "@/types/types";
import NoData from "@/components/NoData";
import ReactPaginate from "react-paginate";
import ArrowIcon from "@/icons/ArrowIcon";
import { useRouter } from "next/router";

const DisasterTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const access_token = Cookies.get("access_token");
  const itemsPerPage = 10;
  const [disasterTransactionData, setDisasterTransactionData] = useState<
    SingleTrustTransactions[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  const getDisasterTransaction = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/api/disasterTran`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDisasterTransactionData(data.allTransaction);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getDisasterTransaction();
  }, []);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  // Calculate start and end index for current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = disasterTransactionData.slice(
    startIndex,
    endIndex
  );

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
                  Donation history
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">Disaster Transaction</h1>
              </div>
              <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-primary">
                {disasterTransactionData.length} transactions
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {currentTransactions.map(
            (
              { donatedAmount, paymentId, transactionDate, tId, _id },
              index
            ) => (
              <div
                key={index}
                onClick={() => {
                  push(`/dashboard/disatertransaction/${_id}`);
                }}
                className="w-full cursor-pointer rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_24px_60px_-28px_rgba(109,40,217,0.45)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Payment ID
                    </span>
                    <p className="text-base font-semibold text-slate-900">{paymentId}</p>
                    <p className="text-sm text-slate-500">{transactionDate.toString()}</p>
                  </div>
                  <div className="flex flex-col items-start gap-1 md:items-end">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Amount
                    </span>
                    <p className="text-2xl font-bold text-rose-600">
                      - ₹ {formatAmount(donatedAmount)}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
          {!currentTransactions.length && !loading && <NoData />}
          {/* Pagination */}
          <ReactPaginate
            previousLabel={<ArrowIcon />}
            nextLabel={<ArrowIcon className="rotate-180" />}
            pageCount={Math.ceil(disasterTransactionData.length / itemsPerPage)}
            onPageChange={handlePageChange}
            containerClassName={"pagination flex justify-center mt-4"}
            activeClassName={"text-primary border border-primary"}
            previousClassName={"px-4 py-2 border rounded"}
            nextClassName={"px-4 py-2 border rounded"}
            pageClassName={"px-4 py-2 border rounded"}
            pageLinkClassName={"cursor-pointer"}
            activeLinkClassName={"text-primary  border-primary"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>
      </div>
    </>
  );
};

export default UserRoute(DisasterTransaction);
