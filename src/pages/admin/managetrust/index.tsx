import React, { useState } from "react";
import AdminFrame from "@/components/AdminFrame";
import DeleteIcon from "@/icons/DeleteIcon";
import EditIcon from "@/icons/EditIcon";
import { dummyUsers } from "@/consts";
import ReactPaginate from "react-paginate";
import ArrowIcon from "@/icons/ArrowIcon";
import { trustData } from "@/consts";

const ManageTrust = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const onPageChange = ({ selected }: any) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const filteredUsers = trustData.filter((user) =>
    Object.values(user).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const currentItems = filteredUsers.slice(offset, offset + itemsPerPage);

  return (
    <AdminFrame title="Manage Trusts">
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
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-3 px-6 text-left bg-gray-200">id</th>
                  <th className="py-3 px-6 text-left bg-gray-200">
                    Trust Name
                  </th>
                  <th className="py-3 px-6 text-left bg-gray-200">
                    Contact No
                  </th>
                  <th className="py-3 px-6 text-left bg-gray-200">
                    Trust Email
                  </th>
                  <th className="py-3 px-6 text-left bg-gray-200">Catagory</th>

                  <th className="py-3 px-6 text-center bg-gray-200">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white rounded-b-lg">
                {currentItems &&
                  currentItems.length > 0 &&
                  currentItems.map(
                    (
                      { id, categoty, conatctNo, trustEmail, trustName },
                      index
                    ) => {
                      return (
                        <tr className="hover:bg-gray-100 transition" key={id}>
                          <td className="py-4 px-6 border-b">
                            {index + 1 + currentPage * itemsPerPage}
                          </td>
                          <td className="py-4 px-6 border-b">{trustName}</td>
                          <td className="py-4 px-6 border-b">{conatctNo}</td>
                          <td className="py-4 px-6 border-b">{trustEmail}</td>
                          <td className="py-4 px-6 border-b">{categoty}</td>
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
                              <div className="flex w-full flex-row items-center justify-center">
                                <button className="flex flex-row items-center justify-center gap-1 rounded-md text-base font-normal leading-5 text-danger-100">
                                  <DeleteIcon />
                                  <span className="hidden text-[#C80707] font-inter text-base font-normal leading-5 text-danger-100 sm:block">
                                    Delete
                                  </span>
                                </button>
                              </div>
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
      <ReactPaginate
        previousLabel={<ArrowIcon />}
        nextLabel={
          <div className="rotate-180">
            <ArrowIcon />
          </div>
        }
        breakLabel={<div className="px-4 py-2 border rounded">...</div>}
        breakClassName={"break-me"}
        pageCount={Math.ceil(filteredUsers.length / itemsPerPage)}
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

export default ManageTrust;
