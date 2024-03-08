import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BACKEND_BASE_URL } from "@/consts";
import { ContactUsType } from "@/types/types";
import Spinner from "@/components/Spinner";

const CustomerQuery = () => {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const [contactQueries, setContactQueries] = useState<ContactUsType[]>();
  const access_token = Cookies.get("access_token");

  const getAllContactQueries = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/contactUs`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setContactQueries(data.contactUs);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllContactQueries();
  }, [access_token]);

  return (
    <AdminFrame title="Customer Query">
      {loading && <Spinner />}
      <div className="w-full flex flex-col gap-3">
        {contactQueries &&
          contactQueries.length &&
          contactQueries.map(({ _id, subject, message }, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  push(`/admin/customerquery/${_id}`);
                }}
                className="flex flex-col gap-1 bg-white hover:bg-gray-100 shadow-md border rounded-md p-2"
              >
                <p className="text-sm font-semibold">
                  Query Id :{" "}
                  <span className="text-gray-400 text-xs">{_id}</span>
                </p>
                <p className="text-sm font-bold">
                  Subject :{" "}
                  <span className="text-gray-400 text-xs">{subject}</span>
                </p>
                <p className="text-sm font-bold">
                  Message :{" "}
                  <span className="text-gray-400 text-xs">{message}</span>
                </p>
              </div>
            );
          })}
      </div>
    </AdminFrame>
  );
};

export default AdminRoute(CustomerQuery);
