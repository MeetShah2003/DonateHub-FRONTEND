import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { TrustData } from "@/types/types";
import { BACKEND_BASE_URL } from "@/consts";
import Spinner from "@/components/Spinner";
import AdminRoute from "@/components/AdminRoute";
import AdminFrame from "@/components/AdminFrame";
import { toast } from "react-toastify";

const SingleTrustDetail = () => {
  const [singleData, setSingleData] = useState<TrustData>();
  const [loading, setLoading] = useState(false);
  const { query } = useRouter();
  const access_token = Cookies.get("access_token");

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const getSingleTrustData = async (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/singleTrust/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSingleData(data.singlePageTrust);
      })
      .catch(() => {
        errorToast("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (query.id) {
      getSingleTrustData(query.id as string);
    }
  }, [query.id, access_token]);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <>
      <AdminFrame title="Trust Detail">
        {loading && <Spinner />}
        <div className="max-w-full w-90% mx-auto my-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row w-full p-3 shadow-md rounded-lg gap-5 bg-gray-100">
              <div className="w-full md:w-1/4 h-full rounded-lg">
                <Image
                  src={singleData?.trustlogo as string}
                  width={500}
                  height={300}
                  className="h-full w-full rounded-lg"
                  alt={"trustLogo"}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-5 justify-between md:gap-48">
                <div className="w-3/4 flex flex-col gap-5 justify-between">
                  <div>
                    <h1 className="text-lg font-semibold">Trust Name</h1>
                    <p className="text-xl text-gray-500">
                      {singleData?.trustName}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">Category</h1>
                    <p className="text-xl text-gray-500">
                      {singleData?.category}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">Founder</h1>
                    <p className="text-xl text-gray-500">
                      {singleData?.founder}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">Current Balance</h1>
                    <p className="text-xl text-gray-500">
                      ₹{formatAmount(singleData?.manualDonation)}
                    </p>
                  </div>
                </div>
                <div className="w-3/4 flex flex-col gap-5">
                  <div>
                    <h1 className="text-lg font-semibold">Email</h1>
                    <p className="text-xl text-gray-500">{singleData?.email}</p>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">Contact No</h1>
                    <p className="text-xl text-gray-500">
                      {singleData?.contactNo}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full p-3 shadow-md rounded-lg gap-5 bg-gray-100">
              <div className="w-full">
                <h1 className="text-lg font-semibold">Description</h1>
                <p className="text-xl text-gray-500">
                  {singleData?.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row w-full p-3 shadow-md rounded-lg gap-5 bg-gray-100">
              <div className="w-full gap-5">
                <h1 className="text-lg font-semibold mb-5">Address</h1>
                <div className="grid md:grid-cols-2 md:grid-rows-2 gap-5">
                  <div>
                    <h1 className="text-base font-normal">Address</h1>
                    <p className="text-lg text-gray-500">
                      {singleData?.address}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-base font-normal">State</h1>
                    <p className="text-lg text-gray-500">{singleData?.state}</p>
                  </div>
                  <div>
                    <h1 className="text-base font-normal">City</h1>
                    <p className="text-lg text-gray-500">{singleData?.city}</p>
                  </div>
                  <div>
                    <h1 className="text-base font-normal">Pincode</h1>
                    <p className="text-lg text-gray-500">
                      {singleData?.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminFrame>
    </>
  );
};

export default AdminRoute(SingleTrustDetail);
