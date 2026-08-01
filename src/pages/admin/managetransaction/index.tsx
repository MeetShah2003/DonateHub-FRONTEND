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
        console.log("supp>>", data);
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
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Relief Transactions
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Monitor transaction activity across trusts
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                The summary and trust-wise cards are displayed in a cleaner layout.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-10">
            {!trustWiseTransaction?.allTrust ? (
              <NoData />
            ) : (
              <div className="flex flex-col gap-4 rounded-[20px] border border-slate-200 bg-slate-50 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Total Collection
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-primary">
                    ₹{formatAmount(trustWiseTransaction.receiveFund)}
                  </p>
                </div>
                <div className="hidden h-16 w-px bg-slate-200 md:block" />
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Total Supporter
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-primary">
                    {trustWiseTransaction.totalUniqueSupporters}
                  </p>
                </div>
              </div>
            )}

            {trustWiseTransaction?.allTrust?.length && (
              <div className="space-y-4">
                {trustWiseTransaction?.allTrust?.map(
                  (
                    {
                      _id,
                      tId,
                      title,
                      description,
                      recievedFund,
                      disasterImage,
                      status,
                      targetFund,
                    },
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
                      statusOfModel={status}
                      fundRequirement={targetFund}
                      onShowTransaction={() => {
                        router.push(`/admin/managetransaction/${_id}/${tId._id}`);
                      }}
                    />
                  )
                )}
              </div>
            )}
          </div>
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
