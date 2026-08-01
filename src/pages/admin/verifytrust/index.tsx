import AdminFrame from "@/components/AdminFrame";
import TrustApprovalModal from "@/components/TrustApprovalModal";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { BACKEND_BASE_URL } from "@/consts";
import NoData from "@/components/NoData";
import AdminRoute from "@/components/AdminRoute";
import Spinner from "@/components/Spinner";
import ReactPaginate from "react-paginate";
import ArrowIcon from "@/icons/ArrowIcon";
import { toast } from "react-toastify";

const VerifyTrust = () => {
  const [unVerifiedTrusts, setUnVerifiedTrusts] = useState([]);
  const access_token = Cookies.get("access_token");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const itemsPerPage = 10;
  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const getPendingTrust = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/admin/allTrustsU`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setUnVerifiedTrusts(data["unverifiedTrusts"]);
      setLoading(false);
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  useEffect(() => {
    getPendingTrust();
  }, [access_token]);

  return (
    <AdminFrame title="Verify Trust">
      {loading && <Spinner />}
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Pending Approvals
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Review and approve incoming trusts
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Each request is shown with the trust summary and review option.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {unVerifiedTrusts &&
            unVerifiedTrusts?.length > 0 &&
            unVerifiedTrusts?.map(
              ({
                trustName,
                description,
                _id,
                trustlogo,
                founder,
                creationDate,
              }) => {
                const date = new Date(creationDate);
                const formattedDate = date.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <div key={_id} className="rounded-[20px] border border-slate-200 bg-slate-50 p-2">
                    <TrustApprovalModal
                      description={description}
                      title={trustName}
                      creationDate={formattedDate}
                      founder={founder}
                      trustImage={trustlogo}
                      onVerify={() => {
                        router.push(`/admin/verifytrust/${_id}`);
                      }}
                    />
                  </div>
                );
              }
            )}
          {!unVerifiedTrusts?.length && !loading && <NoData />}
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
        pageCount={Math.ceil(unVerifiedTrusts?.length / itemsPerPage)}
        marginPagesDisplayed={5}
        pageRangeDisplayed={5}
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

export default AdminRoute(VerifyTrust);
