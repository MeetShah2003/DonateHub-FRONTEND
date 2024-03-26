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
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border outline-none rounded p-2 mb-2"
        />
      </div>
      <div className="border rounded-t-lg rounded-b-lg shadow-sm overflow-x-auto">
        <div className="bg-gray-200 rounded-t-lg">
          <div className="overflow-x-auto">
            {currentItems && (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left bg-gray-200">No</th>
                    <th className="py-3 px-6 text-left bg-gray-200">
                      Trust Name
                    </th>
                    <th className="py-3 px-6 text-left bg-gray-200">
                      Contact No
                    </th>
                    <th className="py-3 px-6 text-left bg-gray-200">
                      Trust Email
                    </th>
                    <th className="py-3 px-6 text-left bg-gray-200">
                      Catagory
                    </th>

                    <th className="py-3 px-6 text-center bg-gray-200">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white rounded-b-lg">
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
                            className="hover:bg-gray-100 transition"
                            onClick={() => {
                              if (_id) {
                                push(`/admin/managetrust/${_id}`);
                              }
                            }}
                            key={_id}
                          >
                            <td className="py-4 px-6 border-b">
                              {index + 1 + currentPage * itemsPerPage}
                            </td>
                            <td className="py-4 px-6 border-b">{trustName}</td>
                            <td className="py-4 px-6 border-b">{contactNo}</td>
                            <td className="py-4 px-6 border-b">{email}</td>
                            <td className="py-4 px-6 border-b">{category}</td>
                            <td className="py-4 px-2 border-b">
                              <div className="flex">
                                <div className="flex w-full flex-row items-center justify-center border-r border-dark-150">
                                  <button className="flex flex-row items-center justify-center gap-1 rounded-md text-base font-normal leading-5 text-gray-1000">
                                    <EditIcon />
                                    <span className="hidden text-blue-600 font-inter text-base font-normal leading-5 text-gray-1000 sm:block">
                                      Edit
                                    </span>
                                  </button>
                                </div>
                                {isBlocked ? (
                                  <div className="flex w-full flex-row items-center justify-center">
                                    <button
                                      onClick={() => {
                                        handleUnblock(_id as string);
                                      }}
                                      className="flex flex-row items-center justify-center gap-1 rounded-md text-base font-normal leading-5 text-danger-100"
                                    >
                                      <UnBlockIcon />
                                      <span className="hidden text-blue-600 font-inter text-base font-normal leading-5 text-danger-100 sm:block">
                                        Unblock
                                      </span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex w-full flex-row items-center justify-center">
                                    <button
                                      onClick={() => {
                                        handleBlock(_id as string);
                                      }}
                                      className="flex flex-row items-center justify-center gap-1 rounded-md text-base font-normal leading-5 text-danger-100"
                                    >
                                      <BlockIcon />
                                      <span className="hidden text-[#C80707] font-inter text-base font-normal leading-5 text-danger-100 sm:block">
                                        Block
                                      </span>
                                    </button>
                                  </div>
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
