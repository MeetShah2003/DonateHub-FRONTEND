import React, { useEffect, useState } from "react";
import AdminFrame from "@/components/AdminFrame";
import BlockIcon from "@/icons/BlockIcon";
import EditIcon from "@/icons/EditIcon";
import { BACKEND_BASE_URL } from "@/consts";
import ReactPaginate from "react-paginate";
import ArrowIcon from "@/icons/ArrowIcon";
import Cookies from "js-cookie";
import { UserData } from "@/types/types";
import UnBlockIcon from "@/icons/UnBlockIcon";
import NoData from "@/components/NoData";
import AdminRoute from "@/components/AdminRoute";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ManageUser = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [allUserData, setAllUserData] = useState<UserData[]>([]);
  const access_token = Cookies.get("access_token");
  const { push } = useRouter();
  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const onPageChange = ({ selected }: any) => {
    setCurrentPage(selected);
  };

  const handleBlock = async (_id: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/admin/blockUser/${_id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        getAllUserData();
      }
      setLoading(false);
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  const handleUnblock = async (_id: string) => {
    setLoading(false);
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/admin/unBlockUser/${_id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        getAllUserData();
      }
      setLoading(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllUserData = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/allUsers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllUserData(data["userRecords"]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllUserData();
  }, []);

  const offset = currentPage * itemsPerPage;
  const filteredUsers = allUserData?.filter((user) =>
    Object.values(user || {}).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const currentItems = filteredUsers?.slice(offset, offset + itemsPerPage);
  return (
    <AdminFrame title="Manage Users">
      {loading && <Spinner />}
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              User Directory
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Manage registered users
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Search users, review profiles, and control account access.
            </p>
          </div>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[20px] border border-slate-200">
          {!currentItems ? (
            <NoData />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-slate-100 text-left text-sm font-semibold text-slate-600">
                    <th className="px-6 py-3">No</th>
                    <th className="px-6 py-3">First Name</th>
                    <th className="px-6 py-3">Last Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Gender</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {currentItems &&
                    currentItems.length > 0 &&
                    currentItems.map(
                      (
                        { firstName, email, gender, lastName, isBlocked, _id },
                        index
                      ) => {
                        return (
                          <tr
                            className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                            key={index}
                          >
                            <td className="px-6 py-4">
                              {index + 1 + currentPage * itemsPerPage}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-900">
                              {firstName}
                            </td>
                            <td className="px-6 py-4">{lastName}</td>
                            <td className="px-6 py-4">{email}</td>
                            <td className="px-6 py-4">{gender}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    if (_id) {
                                      push(`/admin/manageuser/${_id}`);
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
                                      handleUnblock(_id);
                                    }}
                                    className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition"
                                  >
                                    <UnBlockIcon />
                                    <span>Unblock</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      handleBlock(_id);
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
            </div>
          )}
        </div>
      </div>
      {!currentItems?.length ? (
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
      )}
      {!currentItems?.length && !loading && <NoData />}
    </AdminFrame>
  );
};

export default AdminRoute(ManageUser);
