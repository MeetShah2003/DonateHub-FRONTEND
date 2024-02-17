import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { TrustData } from "@/types/types";
import { BACKEND_BASE_URL } from "@/consts";
import Spinner from "@/components/Spinner";
import UserRoute from "@/components/UserRoute/UserRoute";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/auth";
// import { Razorpay } from "razorpay-checkout"; // Import Razorpay

const TrustDetails = () => {
  const [singleData, setSingleData] = useState<TrustData | null>(null);
  const { query } = useRouter();
  const { user } = useAuth();
  const access_token = Cookies.get("access_token");

  const amountValidationSchema = Yup.object().shape({
    amount: Yup.number().required("Amount is required"),
  });

  const { handleSubmit, handleChange, values, errors, touched } = useFormik({
    initialValues: {
      amount: null,
    },
    validationSchema: amountValidationSchema,
    onSubmit: async (values) => {
      const data = {
        amount: values.amount,
        curruncy: "INR",
      };
      const response = await fetch(`${BACKEND_BASE_URL}/api/trustDonate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const order = await response.json();

      console.log(order.order.id);
      //   {
      //     "id": "order_NbfUJFFXjQvgBB",
      //     "entity": "order",
      //     "amount": 5500,
      //     "amount_paid": 0,
      //     "amount_due": 5500,
      //     "currency": "INR",
      //     "receipt": null,
      //     "offer_id": null,
      //     "status": "created",
      //     "attempts": 0,
      //     "notes": [],
      //     "created_at": 1708112082
      // }
      var options = {
        key: "rzp_test_zfmhrR9Z3TReMH", // Enter the Key ID generated from the Dashboard
        amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: data.curruncy,
        name: "DonateHub", //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
          console.log(response);
        },
        prefill: {
          //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
          name: `${user.firstName} ${user.lastName}`, //your customer's name
          email: user.email,
          contact: "9000090000", //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        console.log(response);
      });

      rzp1.open();
    },
  });

  useEffect(() => {
    // Fetch trust details
    const getSingleTrustData = async (id: string) => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/singleTrust/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setSingleData(data["singlePageTrust"]);
        }
      } catch (error) {
        console.error("Error fetching trust details:", error);
      }
    };

    if (query.trustId) {
      getSingleTrustData(query.trustId as string);
    }
  }, [query.trustId, access_token]);

  if (!singleData) {
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
                // onBlur={handleBlur}
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
