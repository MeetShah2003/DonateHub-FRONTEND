import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import { ContactUsType } from "@/types/types";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

const CustomerQueryDetail = () => {
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [contactQuery, setContactQuery] = useState<ContactUsType>();
  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const getSingleCustomerQuery = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/singleContact/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setContactQuery(data.singleContact);
      })
      .catch(() => {
        errorToast("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getSingleCustomerQuery(query?.id as string);
  }, [access_token]);

  return (
    <AdminFrame title="Customer Query Detail">
      {loading && <Spinner />}
      <div className="w-full rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Customer Query
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {contactQuery?.name || "Customer details"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review the customer’s message and contact details in one place.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">
              Query ID
            </span>
            <span className="mt-1 block font-semibold text-slate-900">
              {contactQuery?._id || "—"}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Customer Name
            </p>
            <p className="mt-3 text-base font-semibold text-slate-900">
              {contactQuery?.name || "Not provided"}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Email
            </p>
            <p className="mt-3 text-base font-semibold text-slate-900">
              {contactQuery?.email || "Not provided"}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Contact Number
            </p>
            <p className="mt-3 text-base font-semibold text-slate-900">
              {contactQuery?.contactNo || "Not provided"}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Subject
            </p>
            <p className="mt-3 text-base font-semibold text-slate-900">
              {contactQuery?.subject || "Not provided"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Message
          </p>
          <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-slate-700">
            {contactQuery?.message || "No message provided."}
          </p>
        </div>
      </div>
    </AdminFrame>
  );
};

export default AdminRoute(CustomerQueryDetail);
