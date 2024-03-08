import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import { ContactUsType } from "@/types/types";
import Spinner from "@/components/Spinner";

const CustomerQueryDetail = () => {
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [contactQuery, setContactQuery] = useState<ContactUsType>();

  const getSingleCustomerQuery = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/singleContact/${id}`, {
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
        console.log(data.singleContact);
        setContactQuery(data.singleContact);
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
      <div className="w-full flex flex-col border gap-1">
        <div className="w-full bg-secondary p-2">
          <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
            Customer Name
          </h1>
          <h1 className="pb-1 text-sm font-medium">{contactQuery?.name}</h1>
        </div>

        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="w-full bg-primaryLight p-2">
            <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Email
            </h1>
            <h1 className="pb-1 text-sm font-medium">{contactQuery?.email}</h1>
          </div>
        </div>
        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="w-full bg-secondary p-2">
            <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Contact No
            </h1>
            <h1 className="pb-1 text-sm font-medium">
              {contactQuery?.contactNo}
            </h1>
          </div>
        </div>
        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="w-full bg-primaryLight p-2">
            <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Subject
            </h1>
            <h1 className="pb-1 text-sm font-medium">
              {contactQuery?.subject}
            </h1>
          </div>
        </div>
        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="w-full bg-secondary p-2">
            <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Message
            </h1>
            <h1 className="pb-1 text-sm font-medium">
              {contactQuery?.message}
            </h1>
          </div>
        </div>
        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="w-full bg-primaryLight p-2">
            <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Query Id
            </h1>
            <h1 className="pb-1 text-sm font-medium">{contactQuery?._id}</h1>
          </div>
        </div>
      </div>
    </AdminFrame>
  );
};

export default AdminRoute(CustomerQueryDetail);
