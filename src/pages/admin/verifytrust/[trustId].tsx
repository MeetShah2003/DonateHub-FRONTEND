import AdminFrame from "@/components/AdminFrame";
import AdminRoute from "@/components/AdminRoute";
import { BACKEND_BASE_URL, trustData } from "@/consts";
import { TrustData } from "@/types/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Spinner from "@/components/Spinner";
import Image from "next/image";

const SingleTrust = () => {
  const { query, push } = useRouter();
  const [singleData, setSingleData] = useState<TrustData>();
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  // const formattedDate = singleData
  //   ? new Intl.DateTimeFormat("en-GB", {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //     }).format(new Date(singleData?.creationDate))
  //   : "";

  console.log(singleData?.creationDate);
  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const getSingleTrustData = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/singleTrust/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          setSingleData(data["singlePageTrust"]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getSingleTrustData(query.trustId as string);
  }, [query.trustId, access_token]);

  console.log(singleData);

  const onAccept = async () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/acceptStatus/${query.trustId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data) {
          successToast("Trust Request Accepted");
          push("/admin/verifytrust");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onReject = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/rejectStatus/${query.trustId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data) {
          errorToast("Trust Request Rejected");
          push("/admin/verifytrust");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AdminFrame title="Trust Details">
      {loading && <Spinner />}
      <div className="flex flex-col gap-5 w-full">
        <div className="flex flex-col sm:flex-row w-full gap-8">
          <div className="w-full sm:w-1/3 border-2 rounded-lg">
            <Image
              src={singleData?.trustlogo as string}
              className="flex w-full h-full object-cover rounded-lg"
              alt="trustlogo"
              width={300}
              height={200}
            ></Image>
          </div>
          <div className="w-2/2 flex flex-col gap-5">
            <div className="flex sm:flex-col gap-5 justify-around">
              <div className="flex flex-col">
                <p className="text-lg font-semibold font-inter">Trust Name</p>
                <p className="text-gray-500 text-lg">{singleData?.trustName}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-semibold font-inter">Category</p>
                <p className="text-gray-500 text-lg">{singleData?.category}</p>
              </div>
            </div>
            <div className="flex sm:flex-col gap-5 justify-around">
              <div className="flex flex-col">
                <p className="text-lg font-semibold font-inter">
                  Creation Date
                </p>
                <p className="text-gray-500 text-lg">
                  {singleData?.creationDate.toDateString()}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-semibold font-inter">Founder</p>
                <p className="text-gray-500 text-lg">{singleData?.founder}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="flex flex-col mt-6">
            <p className="text-2xl font-semibold font-inter">About Trust</p>
            <p className="text-gray-500 text-lg">{singleData?.description}</p>
          </div>
          <div className="flex flex-col gap-6 mt-5 mb-5">
            <p className="text-2xl font-semibold font-inter">Contact Details</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="flex w-1/2 flex-col">
                <p className="text-base font-semibold font-inter">Phone No</p>
                <p className="text-gray-500 text-lg">{singleData?.contactNo}</p>
              </div>
              <div className="flex w-1/2 flex-col">
                <p className="text-base font-semibold font-inter">Email</p>
                <p className="text-gray-500 text-lg">{singleData?.email}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-5">
            <p className="text-2xl font-semibold font-inter">Address</p>
            <div className="flex flex-col gap-2 sm:flex-row w-full">
              <div className="flex w-full sm:w-1/2  flex-col">
                <p className="text-base font-semibold font-inter">Address</p>
                <p className="text-gray-500 text-lg">{singleData?.address}</p>
              </div>
              <div className="flex w-1/2 flex-col">
                <p className="text-base font-semibold font-inter">State</p>
                <p className="text-gray-500 text-lg">{singleData?.state}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row w-full">
              <div className="flex w-1/2 flex-col">
                <p className="text-base font-semiboldmt font-inter">City</p>
                <p className="text-gray-500 text-lg">{singleData?.city}</p>
              </div>
              <div className="flex w-1/2 flex-col">
                <p className="text-base font-semibold font-inter">Pincode</p>
                <p className="text-gray-500 text-lg">{singleData?.pincode}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10 gap-5">
            <div>
              <button
                onClick={() => {
                  onAccept();
                }}
                className="bg-green-700 hover:bg-green-600 rounded-md text-white py-2 px-6"
              >
                Accept
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  onReject();
                }}
                className="bg-red-700 hover:bg-red-600 rounded-md text-white py-2 px-6"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminFrame>
  );
};

export default AdminRoute(SingleTrust);
