import React, { useEffect, useState } from "react";
import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import TransactionTrustsModel from "@/components/TransactionTrustsModel";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import NoData from "@/components/NoData";
import { TrustWiseTransaction } from "@/types/types";
import ReactPaginate from "react-paginate";
import ArrowIcon from "@/icons/ArrowIcon";
import { toast } from "react-toastify";

const ManageTransaction = () => {
  const access_token = Cookies.get("access_token");
  const [trustWiseTransaction, setTrustWiseTransaction] =
    useState<TrustWiseTransaction>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const itemsPerPage = 10;

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/admin/trustTransaction`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTrustWiseTransaction(data);
        setLoading(false);
      } catch (error) {
        errorToast("Something went wrong");
        setLoading(false);
      }
    };

    fetchData();
  }, [access_token]);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <AdminFrame title="Manage Transaction">
      {loading ? (
        <Spinner />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="flex flex-col gap-10">
          {!trustWiseTransaction?.allTrust ? (
            <NoData />
          ) : (
            <div className="w-full flex flex-col md:flex-row justify-between items-center bg-gray-100 rounded-lg p-6">
              <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
                <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                  Total Collection
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  ₹{formatAmount(trustWiseTransaction.receiveFund)}
                </p>
              </div>
              <div className="w-1/2 border-t border-gray-300 md:border-none my-4 md:my-0"></div>
              <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
                <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                  Total Supporter
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {5}
                </p>
              </div>
            </div>
          )}

          {trustWiseTransaction?.allTrust?.length &&
            trustWiseTransaction?.allTrust?.map(
              (
                { _id, tId, title, description, recievedFund, disasterImage },
                index
              ) => (
                <TransactionTrustsModel
                  key={_id}
                  title={title}
                  description={description}
                  trustImage={disasterImage}
                  founder={tId.founder}
                  creationDate={tId.creationDate}
                  amount={recievedFund}
                  onShowTransaction={() => {
                    router.push(`/admin/managetransaction/${_id}/${tId._id}`);
                  }}
                />
              )
            )}
        </div>
      )}

      {!trustWiseTransaction?.allTrust?.length && !loading && <NoData />}

      <ReactPaginate
        previousLabel={<ArrowIcon />}
        nextLabel={
          <div className="rotate-180">
            <ArrowIcon />
          </div>
        }
        breakLabel={<div className="px-4 py-2 border rounded">...</div>}
        breakClassName={"break-me"}
        pageCount={Math.ceil(
          (trustWiseTransaction?.allTrust?.length as number) / itemsPerPage
        )}
        marginPagesDisplayed={5}
        pageRangeDisplayed={5}
        containerClassName={"pagination flex justify-center mt-4"}
        activeClassName={"text-primary border border-primary"}
        previousClassName={"px-4 py-2 border rounded"}
        nextClassName={"px-4 py-2 border rounded"}
        pageClassName={"px-4 py-2 border rounded"}
        pageLinkClassName={"cursor-pointer"}
        activeLinkClassName={"text-primary  border-primary"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
      />
    </AdminFrame>
  );
};

export default AdminRoute(ManageTransaction);
