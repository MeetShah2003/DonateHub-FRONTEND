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

const ListOfAskForFunds = () => {
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
      `${BACKEND_BASE_URL}/trust/myAskForFund?page=${page}&perPage=${itemsPerPage}`,
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
        setFundRequests(data.allAskForFund);
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

      <TrustNavbar title="List Of AskForFunds">
        <div className="w-full mx-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left bg-gray-200">No</th>
                <th className="py-3 px-6 text-left bg-gray-200">Title</th>
                <th className="py-3 px-6 text-center bg-gray-200">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white rounded-b-lg">
              {fundRequests &&
                fundRequests.length &&
                fundRequests.map(({ _id, title, transactionDate }, index) => {
                  return (
                    <tr className="hover:bg-gray-100 transition" key={_id}>
                      <td className="py-4 px-6 border-b">
                        {index + 1 + currentPage * itemsPerPage}
                      </td>
                      <td className="py-4 px-6 border-b">{title}</td>

                      <td className="py-4 px-6 border-b">
                        <div className="flex">
                          <div className="flex w-full flex-row items-center justify-center border-r border-dark-150">
                            <button
                              onClick={() => {
                                push(`/trust/listoffundrequest/${_id}`);
                              }}
                              className="flex flex-row bg-primary text-white p-2 items-center justify-center gap-1 rounded-md text-base font-normal leading-5 text-gray-1000"
                            >
                              Show Details
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {fundRequests?.length === 0 && !loading && <NoData />}
        {fundRequests?.length > 0 && !loading && (
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
      </TrustNavbar>
    </div>
  );
};

export default TrustRoute(ListOfAskForFunds);
