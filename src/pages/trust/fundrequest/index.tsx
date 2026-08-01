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
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mx-auto w-full max-w-5xl">
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
                breakLabel={<div className="rounded border px-4 py-2">...</div>}
                breakClassName={"break-me"}
                pageCount={Math.ceil(fundRequests.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                containerClassName={"pagination mt-4 flex justify-center gap-2"}
                activeClassName={"text-primary border border-primary"}
                previousClassName={"rounded border px-4 py-2"}
                nextClassName={"rounded border px-4 py-2"}
                pageClassName={"rounded border px-4 py-2"}
                pageLinkClassName={"cursor-pointer"}
                activeLinkClassName={"text-primary border-primary"}
                disabledClassName={"cursor-not-allowed opacity-50"}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </TrustNavbar>
    </div>
  );
};

export default TrustRoute(FundRequests);
