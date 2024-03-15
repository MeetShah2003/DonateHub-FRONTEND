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
      .catch((error) => {
        errorToast("something went wrong");
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
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="border outline-none rounded p-2 mb-2"
        />
      </div>
      <div className="border rounded-t-lg rounded-b-lg shadow-sm overflow-x-auto">
        {!currentQueries ? (
          <NoData />
        ) : (
          <div className="bg-gray-200 rounded-t-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left bg-gray-200">No</th>
                    <th className="py-3 px-6 text-left bg-gray-200">Subject</th>
                    <th className="py-3 px-6 text-left bg-gray-200">Message</th>
                  </tr>
                </thead>
                <tbody className="bg-white rounded-b-lg">
                  {currentQueries &&
                    currentQueries.length > 0 &&
                    currentQueries.map(({ _id, subject, message }, index) => {
                      return (
                        <tr
                          className="hover:bg-gray-100 transition cursor-pointer"
                          onClick={() => {
                            push(`/admin/customerquery/${_id}`);
                          }}
                          key={index}
                        >
                          <td className="py-4 px-6 border-b">
                            {index + 1 + currentPage * itemsPerPage}
                          </td>
                          <td className="py-4 px-6 border-b">{subject}</td>
                          <td className="py-4 px-6 border-b">{message}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
