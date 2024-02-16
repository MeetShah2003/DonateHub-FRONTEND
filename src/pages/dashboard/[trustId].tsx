import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { TrustData } from "@/types/types";
import { BACKEND_BASE_URL, trustData } from "@/consts";
import Spinner from "@/components/Spinner";
import UserRoute from "@/components/UserRoute/UserRoute";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Razorpay } from "razorpay-checkout";
import { useAuth } from "@/context/auth";

const TrustDetails = () => {
  const [orderId, setOrderId] = useState("");
  console.log(useAuth().user);
  const { user } = useAuth();
  const access_token = Cookies.get("access_token");

  const amountValidationSchema = Yup.object().shape({
    amount: Yup.number().required("Amount is required"),
  });

  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState<TrustData | null>(null);
  const { handleBlur, handleChange, handleSubmit, touched, errors, values } =
    useFormik({
      initialValues: {
        amount: null,
      },
      validationSchema: amountValidationSchema,
      onSubmit: (value) => {
        fetch(`${BACKEND_BASE_URL}/api/trustDonate`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: value.amount,
            trustId: query.trustId,
          }),
        })
          .then((res) => {
            if (res && res.status === 200) {
              return res.json();
            }
          })
          .then((data) => {
            console.log(user);
            if (data && typeof window !== "undefined") {
              const rzp = new Razorpay({
                key: "rzp_test_zfmhrR9Z3TReMH",
                amount: data.order.amount,
                currency: "INR",
                name: "DonateHub",
                description: "Donation",
                order_id: data.order.id,
                handler: function (response) {
                  console.log("Payment successful:", response);
                },
                prefill: {
                  name: `${user.firstName} ${user.lastName}`,
                  email: user.email,
                },
                theme: {
                  color: "#674CC4",
                },
              });
              rzp.open();
            }
          })
          .catch((errors) => {
            console.log(errors);
          });
      },
    });
  const { query } = useRouter();
  // const formattedDate = singleData
  //   ? new Intl.DateTimeFormat("en-GB", {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //     }).format(new Date(singleData.creationDate))
  //   : "";

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
    <div className="flex flex-col gap-5 my-5 w-full">
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
              {/* <p className="text-gray-500 text-lg">{formattedDate}</p> */}
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
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mt-10 gap-5">
            <div className="border border-primary rounded-md">
              <input
                type="number"
                id="amount"
                value={values.amount}
                placeholder="Enter Amount"
                name="amount"
                className="h-full w-full outline-none px-2 rounded-md"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-primary rounded-md text-white py-2 px-6"
              >
                Donate
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRoute(TrustDetails);
