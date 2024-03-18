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

const FundRequests = () => {
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [fundRequests, setFundRequests] = useState<RequestFunds[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const getRequestData = (page: number) => {
    setLoading(true);
    fetch(
      `${BACKEND_BASE_URL}/trust/fundReq?page=${page}&perPage=${itemsPerPage}`,
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
        setFundRequests(data.allMyReq);
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

      <TrustNavbar title="Fund Requests">
        <div className="w-fit mx-auto">
          {fundRequests.map((data, index) => {
            return <FundRequestsModel key={index} data={data} />;
          })}
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
      </TrustNavbar>
    </div>
  );
};

export default TrustRoute(FundRequests);
