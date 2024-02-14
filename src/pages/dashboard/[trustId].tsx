import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { TrustData } from "@/types/types";
import { BACKEND_BASE_URL } from "@/consts";
import Spinner from "@/components/Spinner";
import UserRoute from "@/components/UserRoute/UserRoute";

const TrustDetails = () => {
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState<TrustData | null>(null);
  const { query } = useRouter();
  const access_token = Cookies.get("access_token");

  const getSingleTrustData = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/api/singleTrust/${id}`, {
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

  if (loading) {
    return <Spinner />;
  }

  return (
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
              <p className="text-lg font-semibold font-inter">Creation Date</p>
              <p className="text-gray-500 text-lg">
                {singleData?.creationDate}
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
                // onAccept();
              }}
              className="bg-green-700 hover:bg-green-600 rounded-md text-white py-2 px-6"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoute(TrustDetails);
