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
              <div key={_id} className="my-2">
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
