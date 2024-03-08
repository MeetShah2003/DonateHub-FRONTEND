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

const ManageUser = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [allUserData, setAllUserData] = useState<UserData[]>([]);
  const access_token = Cookies.get("access_token");
  const { push } = useRouter();

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
      console.error("Error fetching data:", error);
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
        {!currentItems ? (
          <NoData />
        ) : (
          <div className="bg-gray-200 rounded-t-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left bg-gray-200">No</th>
                    <th className="py-3 px-6 text-left bg-gray-200">
                      First Name
                    </th>
                    <th className="py-3 px-6 text-left bg-gray-200">
                      Last Name
                    </th>
                    <th className="py-3 px-6 text-left bg-gray-200">Email</th>
                    <th className="py-3 px-6 text-left bg-gray-200">Gender</th>
                    <th className="py-3 px-6 text-center bg-gray-200">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white rounded-b-lg">
                  {currentItems &&
                    currentItems.length > 0 &&
                    currentItems.map(
                      (
                        { firstName, email, gender, lastName, isBlocked, _id },
                        index
                      ) => {
                        return (
                          <tr
                            className="hover:bg-gray-100 transition"
                            onClick={() => {
                              if (_id) {
                                push(`/admin/manageuser/${_id}`);
                              }
                            }}
                            key={index}
                          >
                            <td className="py-4 px-6 border-b">
                              {index + 1 + currentPage * itemsPerPage}
                            </td>
                            <td className="py-4 px-6 border-b">{firstName}</td>
                            <td className="py-4 px-6 border-b">{lastName}</td>
                            <td className="py-4 px-6 border-b">{email}</td>
                            <td className="py-4 px-6 border-b">{gender}</td>
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
                                        handleUnblock(_id);
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
                                        handleBlock(_id);
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
            </div>
          </div>
        )}
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
