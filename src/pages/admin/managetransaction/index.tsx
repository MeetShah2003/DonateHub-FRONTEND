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

const ManageTransaction = () => {
  const access_token = Cookies.get("access_token");
  const [trustWiseTransaction, setTrustWiseTransaction] =
    useState<TrustWiseTransaction>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const itemsPerPage = 10;
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
        console.log(data);
        setTrustWiseTransaction(data);
        setLoading(false);
      } catch (error: any) {
        setError(error);
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
          {!trustWiseTransaction ? (
            <NoData />
          ) : (
            <div className="w-full flex flex-col md:flex-row justify-between items-center bg-gray-100 rounded-lg p-6">
              <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
                <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                  Total Collection
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  ₹{formatAmount(trustWiseTransaction?.TotalAmount)}
                </p>
              </div>
              <div className="w-1/2 border-t border-gray-300 md:border-none my-4 md:my-0"></div>
              <div className="flex flex-col w-1/2 items-center justify-center mb-4 md:mb-0">
                <h2 className="font-semibold flex-wrap text-xl md:text-2xl">
                  Total Supporter
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {trustWiseTransaction?.totalSupporters}
                </p>
              </div>
            </div>
          )}

          {trustWiseTransaction?.Tdata &&
            trustWiseTransaction?.Tdata?.length &&
            trustWiseTransaction?.Tdata.map(
              (
                {
                  _id,
                  trustName,
                  description,
                  trustlogo,
                  founder,
                  creationDate,
                  TotalAmount,
                },
                index
              ) => {
                return (
                  <TransactionTrustsModel
                    key={_id}
                    title={trustName}
                    description={description}
                    trustImage={trustlogo}
                    founder={founder}
                    creatsionDate={creationDate}
                    amount={TotalAmount}
                    onShowTransaction={() => {
                      console.log(_id);
                      router.push(`/admin/managetransaction/${_id}`);
                    }}
                  />
                );
              }
            )}
        </div>
      )}

      {!trustWiseTransaction?.Tdata?.length && !loading && <NoData />}
      <ReactPaginate
        previousLabel={<ArrowIcon />}
        nextLabel={
          <div className="rotate-180">
            <ArrowIcon />
          </div>
        }
        breakLabel={<div className="px-4 py-2 border rounded">...</div>}
        breakClassName={"break-me"}
        pageCount={Math.ceil(trustWiseTransaction?.Tdata.length / itemsPerPage)}
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
