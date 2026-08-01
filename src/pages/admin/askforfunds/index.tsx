import FundRequestsModel from "@/components/FundRequestsModel";
import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { BACKEND_BASE_URL } from "@/consts";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { RequestFunds } from "@/types/types";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import NoData from "@/components/NoData";
import ReactPaginate from "react-paginate";
import ArrowIcon from "@/icons/ArrowIcon";
import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import EditIcon from "@/icons/EditIcon";
import { useRouter } from "next/router";

const FundRequests = () => {
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [fundRequests, setFundRequests] = useState<RequestFunds[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { push } = useRouter();
  const itemsPerPage = 10;

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const getRequestData = (page: number) => {
    setLoading(true);
    fetch(
      `${BACKEND_BASE_URL}/admin/allAskForFund?page=${page}&perPage=${itemsPerPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFundRequests(data.fundRequirement);
      })
      .catch((error) => {
        errorToast("Something Went Wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getRequestData(currentPage);
  }, [currentPage]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      {loading && <Spinner />}

      <AdminFrame title="Fund Requests">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Fund Requests
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Review support requests from trusts
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Each request is shown with status and quick access to the full detail view.
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[20px] border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="bg-slate-100 text-left text-sm font-semibold text-slate-600">
                    <th className="px-6 py-3">No</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {fundRequests.map(
                    ({ _id, title, transactionDate, status }, index) => {
                      return (
                        <tr className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50" key={_id}>
                          <td className="px-6 py-4">
                            {index + 1 + currentPage * itemsPerPage}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">{title}</td>
                          <td className="px-6 py-4">
                            {status
                              ?.charAt(0)
                              .toUpperCase()
                              .concat(status?.slice(1))}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button
                                onClick={() => {
                                  push(`/admin/askforfunds/${_id}`);
                                }}
                                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                              >
                                Show Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {fundRequests.length === 0 && !loading && <NoData />}
        {fundRequests.length > 0 && !loading && (
          <>
            <ReactPaginate
              previousLabel={<ArrowIcon />}
              nextLabel={
                <div className="rotate-180">
                  <ArrowIcon />
                </div>
              }
              breakLabel={<div className="px-4 py-2 border rounded">...</div>}
              breakClassName={"break-me"}
              pageCount={Math.ceil(fundRequests.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              containerClassName={"pagination flex justify-center mt-4"}
              activeClassName={"text-primary border border-primary"}
              previousClassName={"px-4 py-2 border rounded"}
              nextClassName={"px-4 py-2 border rounded"}
              pageClassName={"px-4 py-2 border rounded"}
              pageLinkClassName={"cursor-pointer"}
              activeLinkClassName={"text-primary  border-primary"}
              disabledClassName={"opacity-50 cursor-not-allowed"}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </AdminFrame>
    </div>
  );
};

export default AdminRoute(FundRequests);
