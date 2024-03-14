import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { BACKEND_BASE_URL } from "@/consts";
import { SingleTrustTransaction } from "@/types/types";
import NoData from "@/components/NoData";
import ReactPaginate from "react-paginate";
import ArrowIcon from "@/icons/ArrowIcon";

const TrustTransaction = () => {
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const itemsPerPage = 10;
  const [disasterTransactionData, setDisasterTransactionData] = useState<
    SingleTrustTransaction[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  const getDisasterTransaction = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/api/manualTran`, {
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
        console.log(data);
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
      <div className="max-w-screen-lg w-90% mx-auto">
        <h1 className="my-5 text-2xl font-semibold">Disaster Transaction</h1>

        <div className="flex flex-col gap-3">
          {currentTransactions.map(
            (
              { manualDonatedAmount, paymentId, transactionDate, tId },
              index
            ) => (
              <div
                key={index}
                className="w-full bg-white rounded-lg shadow-md border p-4"
              >
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div>
                      <p className="text-gray-500 text-sm">{paymentId}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <h2 className="text-lg font-semibold mb-2">Amount</h2>
                    <p className="text-xl font-normal text-red-600">
                      - ₹ {formatAmount(manualDonatedAmount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transactionDate.toString()}
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

export default UserRoute(TrustTransaction);
