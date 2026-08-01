import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import TrustNavbar from "../../../components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { RequestFunds, RequestFundsForAdmin } from "@/types/types";
import UploadDocumentList from "@/components/UploadDocumentList";
import AdminRoute from "@/components/AdminRoute";
import AdminFrame from "@/components/AdminFrame";

const RequestFund = () => {
  const access_token = Cookies.get("access_token");
  const [loading, setLoading] = useState(false);
  const [singleRequestData, setSingleRequestData] =
    useState<RequestFundsForAdmin>();
  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);
  const { push, query } = useRouter();

  const getSingleRequestData = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/singleAskForFund/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        } else if (res && res.status === 400) {
          errorToast("Some thing went wrong");
          push(`/trust/fundrequest`);
        }
      })
      .then((data) => {
        setSingleRequestData(data.singleUserDetails);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const DownloadImages = async (imageUrls: string[]) => {
    setLoading(true);
    try {
      for (const imageUrl of imageUrls) {
        window.open(imageUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Error downloading images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleRequestData(query.id as string);
  }, []);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <div>
      {loading && <Spinner />}

      <AdminFrame title="Request Funds">
        <div className="w-full rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Fund Request Detail
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {singleRequestData?.title || "Fund request"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Review the request summary and supporting documents here.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                Status
              </span>
              <span className="mt-1 block font-semibold text-slate-900">
                {singleRequestData?.status
                  ?.charAt(0)
                  .toUpperCase()
                  .concat(singleRequestData.status?.slice(1)) || "Pending"}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Trust Name
              </p>
              <p className="mt-3 text-base font-semibold text-slate-900">
                {singleRequestData?.tId?.trustName || "Not available"}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Requested Amount
              </p>
              <p className="mt-3 text-base font-semibold text-slate-900">
                ₹{formatAmount(singleRequestData?.reqAmount) || "0"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Description
            </p>
            <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-slate-700">
              {singleRequestData?.description || "No description provided."}
            </p>
          </div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Upload Documents
            </p>
            {Array.isArray(singleRequestData?.documents) &&
            singleRequestData?.documents.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <UploadDocumentList documents={singleRequestData.documents} />
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                No documents uploaded for this request.
              </p>
            )}
          </div>
        </div>
      </AdminFrame>
    </div>
  );
};

export default AdminRoute(RequestFund);
