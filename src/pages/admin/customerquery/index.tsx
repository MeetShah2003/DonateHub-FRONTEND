import React, { useEffect, useState } from "react";
import AdminFrame from "@/components/AdminFrame";
import { BACKEND_BASE_URL } from "@/consts";
import ReactPaginate from "react-paginate";
import ArrowIcon from "@/icons/ArrowIcon";
import Cookies from "js-cookie";
import { ContactUsType } from "@/types/types";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import NoData from "@/components/NoData";
import AdminRoute from "@/components/AdminRoute";
import { toast } from "react-toastify";

const CustomerQuery = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactQueries, setContactQueries] = useState<ContactUsType[]>([]);
  const access_token = Cookies.get("access_token");
  const { push } = useRouter();

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const onPageChange = ({ selected }: any) => {
    setCurrentPage(selected);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getAllContactQueries = () => {
    setLoading(true);
    fetch(
      `${BACKEND_BASE_URL}/admin/contactUs?page=${currentPage}&limit=${itemsPerPage}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to fetch data");
      })
      .then((data) => {
        setContactQueries(data.contactUs);
      })
      .catch(() => {
        errorToast("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllContactQueries();
  }, [currentPage, access_token]);

  const offset = currentPage * itemsPerPage;
  const filteredQueries = contactQueries?.filter((query) =>
    Object.values(query || {}).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const currentQueries = filteredQueries?.slice(offset, offset + itemsPerPage);

  return (
    <AdminFrame title="Customer Query">
      {loading && <Spinner />}
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Customer Messages
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Review incoming customer queries
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Search and open any customer message to view the full request.
            </p>
          </div>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search queries..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[20px] border border-slate-200">
          {!currentQueries ? (
            <NoData />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-slate-100 text-left text-sm font-semibold text-slate-600">
                    <th className="px-6 py-3">No</th>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Message</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {currentQueries &&
                    currentQueries.length > 0 &&
                    currentQueries.map(({ _id, subject, message }, index) => {
                      return (
                        <tr
                          className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                          key={index}
                        >
                          <td className="px-6 py-4">
                            {index + 1 + currentPage * itemsPerPage}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">{subject}</td>
                          <td className="px-6 py-4">{message}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button
                                onClick={() => {
                                  push(`/admin/customerquery/${_id}`);
                                }}
                                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {!currentQueries?.length ? (
        ""
      ) : (
        <ReactPaginate
          previousLabel={<ArrowIcon />}
          nextLabel={
            <div className="rotate-180">
              <ArrowIcon />
            </div>
          }
          breakLabel={<div className="px-4 py-2 border rounded">...</div>}
          breakClassName={"break-me"}
          pageCount={Math.ceil(filteredQueries?.length / itemsPerPage)}
          marginPagesDisplayed={5}
          pageRangeDisplayed={5}
          onPageChange={onPageChange}
          containerClassName={"pagination flex justify-center mt-4"}
          activeClassName={"text-primary border border-primary"}
          previousClassName={"px-4 py-2 border rounded"}
          nextClassName={"px-4 py-2 border rounded"}
          pageClassName={"px-4 py-2 border rounded"}
          pageLinkClassName={"cursor-pointer"}
          activeLinkClassName={"text-primary  border-primary"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      )}
      {!currentQueries?.length && !loading && <NoData />}
    </AdminFrame>
  );
};

export default AdminRoute(CustomerQuery);
