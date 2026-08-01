import React, { useEffect, useState } from "react";
import AdminFrame from "@/components/AdminFrame";
import BlockIcon from "@/icons/BlockIcon";
import EditIcon from "@/icons/EditIcon";
import { BACKEND_BASE_URL } from "@/consts";
import ReactPaginate from "react-paginate";
import ArrowIcon from "@/icons/ArrowIcon";
import Cookies from "js-cookie";
import { TrustData } from "@/types/types";
import UnBlockIcon from "@/icons/UnBlockIcon";
import NoData from "@/components/NoData";
import AdminRoute from "@/components/AdminRoute";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ManageTrust = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [allTrustData, setAllTrustData] = useState<TrustData[]>([]);
  const access_token = Cookies.get("access_token");
  const { push } = useRouter();

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const onPageChange = ({ selected }: any) => {
    setCurrentPage(selected);
  };

  const getAllTrust = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/allTrustsV`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllTrustData(data["verifiedTrusts"]);
      })
      .catch((error) => {
        errorToast("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBlock = async (_id: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/admin/blockTrust/${_id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        getAllTrust();
      }
      setLoading(false);
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  const handleUnblock = async (_id: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/admin/unBlockTrust/${_id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        getAllTrust();
      }
      setLoading(false);
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  useEffect(() => {
    getAllTrust();
  }, []);

  const offset = currentPage * itemsPerPage;
  const filteredUsers = allTrustData?.filter((user) =>
    Object.values(user).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const currentItems = filteredUsers?.slice(offset, offset + itemsPerPage);

  return (
    <AdminFrame title="Manage Trusts">
      {loading && <Spinner />}
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Trust Registry
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Manage verified trusts
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review trust details, edit access, and toggle account status.
            </p>
          </div>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search trusts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[20px] border border-slate-200">
          <div className="overflow-x-auto">
            {currentItems && (
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-slate-100 text-left text-sm font-semibold text-slate-600">
                    <th className="px-6 py-3">No</th>
                    <th className="px-6 py-3">Trust Name</th>
                    <th className="px-6 py-3">Contact No</th>
                    <th className="px-6 py-3">Trust Email</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {currentItems &&
                    currentItems.length > 0 &&
                    currentItems?.map(
                      (
                        {
                          _id,
                          category,
                          contactNo,
                          email,
                          trustName,
                          isBlocked,
                        },
                        index
                      ) => {
                        return (
                          <tr
                            className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                            key={_id}
                          >
                            <td className="px-6 py-4">
                              {index + 1 + currentPage * itemsPerPage}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-900">
                              {trustName}
                            </td>
                            <td className="px-6 py-4">{contactNo}</td>
                            <td className="px-6 py-4">{email}</td>
                            <td className="px-6 py-4">{category}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    if (_id) {
                                      push(`/admin/managetrust/${_id}`);
                                    }
                                  }}
                                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
                                >
                                  <EditIcon />
                                  <span>Edit</span>
                                </button>
                                {isBlocked ? (
                                  <button
                                    onClick={() => {
                                      handleUnblock(_id as string);
                                    }}
                                    className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition"
                                  >
                                    <UnBlockIcon />
                                    <span>Unblock</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      handleBlock(_id as string);
                                    }}
                                    className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition"
                                  >
                                    <BlockIcon />
                                    <span>Block</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {!currentItems?.length && <NoData />}
      </div>
      <ReactPaginate
        previousLabel={<ArrowIcon />}
        nextLabel={
          <div className="rotate-180">
            <ArrowIcon />
          </div>
        }
        breakLabel={<div className="px-4 py-2 border rounded">...</div>}
        breakClassName={"break-me"}
        pageCount={Math.ceil(filteredUsers?.length / itemsPerPage)}
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
    </AdminFrame>
  );
};

export default AdminRoute(ManageTrust);
