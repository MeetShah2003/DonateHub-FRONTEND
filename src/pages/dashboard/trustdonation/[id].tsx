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
import Visitor from "@/components/Visitor";
import RuppeSymbol from "@/icons/RuppeSymbol";
import ReviewSection from "@/components/ReviewSection";

const TrustDetails = () => {
  const [singleData, setSingleData] = useState<TrustData>();
  const { query } = useRouter();
  const { user } = useAuth();
  const access_token = Cookies.get("access_token");

  const amountValidationSchema = Yup.object().shape({
    amount: Yup.number().required("Amount is required"),
  });

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
        setSingleData(data.singlePageTrust);
      }
    } catch (error) {
      console.error("Error fetching trust details:", error);
    }
  };

  const { handleSubmit, handleChange, setValues, values, errors, touched } =
    useFormik({
      initialValues: {
        amount: null || 0,
      },
      validationSchema: amountValidationSchema,
      onSubmit: async (values) => {
        const data = {
          amount: values.amount,
          curruncy: "INR",
          trustId: query.id,
        };
        const response = await fetch(`${BACKEND_BASE_URL}/api/manualDonate`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const order = await response.json();
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
          key: "rzp_test_zfmhrR9Z3TReMH",
          amount: data.amount,
          currency: data.curruncy,
          name: "DonateHub",
          description: "Test Transaction",
          image:
            "https://firebasestorage.googleapis.com/v0/b/donatehub-d09f5.appspot.com/o/DonateHUB_Logo%2Fdonatehublogo.png?alt=media&token=2cd59db5-3e2a-4d23-93e8-b2ee36314453",
          order_id: order.order.id,
          handler: (response: any) => {
            getSingleTrustData(query.id as string);
          },
          prefill: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            contact: "9000090000",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#674CC4",
          },
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", function (response: any) {
          console.log(response);
        });

        rzp1.open();
      },
    });

  useEffect(() => {
    if (query.id) {
      getSingleTrustData(query.id as string);
    }
  }, [query.id, access_token]);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  if (!singleData) {
    return <Spinner />;
  }

  //   const progress = (singleData.tId.TotalAmount / singleData.targetFund) * 100;

  return (
    <>
      <div className="navbar sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      <div className="max-w-full w-90% mx-auto my-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row w-full p-3 shadow-md rounded-lg gap-5 bg-gray-100">
            <div className="w-full md:w-1/4 h-full rounded-lg">
              <Image
                src={singleData.trustlogo}
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
                    {singleData.trustName}
                  </p>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Catagory</h1>
                  <p className="text-xl text-gray-500">{singleData.category}</p>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Founder</h1>
                  <p className="text-xl text-gray-500">{singleData.founder}</p>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Currunt Balance</h1>
                  <p className="text-xl text-gray-500">
                    ₹{formatAmount(singleData.manualDonation)}
                  </p>
                </div>
              </div>
              <div className="w-3/4 flex flex-col gap-5">
                <div>
                  <h1 className="text-lg font-semibold">Email</h1>
                  <p className="text-xl text-gray-500">{singleData.email}</p>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Contact No</h1>
                  <p className="text-xl text-gray-500">
                    {singleData.contactNo}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full p-3 shadow-md rounded-lg gap-5 bg-gray-100">
            <div className="w-full">
              <h1 className="text-lg font-semibold">Description</h1>
              <p className="text-xl text-gray-500">{singleData.description}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full p-3 shadow-md rounded-lg gap-5 bg-gray-100">
            <div className="w-full gap-5">
              <h1 className="text-lg font-semibold mb-5">Address</h1>
              <div className="grid md:grid-cols-2 md:grid-rows-2 gap-5">
                <div>
                  <h1 className="text-base font-normal">Address</h1>
                  <p className="text-lg text-gray-500">{singleData.address}</p>
                </div>
                <div>
                  <h1 className="text-base font-normal">State</h1>
                  <p className="text-lg text-gray-500">{singleData.state}</p>
                </div>
                <div>
                  <h1 className="text-base font-normal">City</h1>
                  <p className="text-lg text-gray-500">{singleData.city}</p>
                </div>
                <div>
                  <h1 className="text-base font-normal">Pincode</h1>
                  <p className="text-lg text-gray-500">{singleData.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row w-full p-3 shadow-md rounded-lg gap-5 bg-gray-100">
              <form className="w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-3/4">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <RuppeSymbol />
                    </span>
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      maxLength={7}
                      value={values.amount}
                      onChange={handleChange}
                      className="w-full border border-primary outline-none rounded-lg pl-10 p-2"
                      placeholder="Enter Amount"
                    />
                    {touched.amount && errors.amount ? (
                      <div className="text-red-500">{errors.amount}</div>
                    ) : null}
                  </div>
                  <div className="flex flex-col w-full sm:w-1/4 border-2 bg-primary shadow-sm rounded-lg px-2 py-2">
                    <button
                      type="submit"
                      className="outline-none text-white font-inter font-medium"
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex flex-col md:flex-row w-full p-3 shadow-md rounded-lg gap-5 bg-gray-100">
              <div className="w-full">
                <h1 className="text-lg font-semibold mb-2">Suggestions</h1>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 100 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹100
                    </button>
                  </div>
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 500 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹500
                    </button>
                  </div>
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 1000 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹1000
                    </button>
                  </div>
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 1500 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹1500
                    </button>
                  </div>
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 2000 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹2000
                    </button>
                  </div>
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 2500 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹2500
                    </button>
                  </div>
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 3000 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹3000
                    </button>
                  </div>
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 5000 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹5000
                    </button>
                  </div>
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 15000 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹15,000
                    </button>
                  </div>
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 20000 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹20,000
                    </button>
                  </div>
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 25000 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹25,000
                    </button>
                  </div>
                  <div className="w-full text-center border-2 border-primary bg-white shadow-sm rounded-lg px-2 py-2">
                    <button
                      onClick={() => {
                        setValues({ amount: 50000 });
                      }}
                      type="button"
                      className="outline-none text-black font-inter font-medium"
                    >
                      ₹50,000
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full p-3 shadow-md rounded-lg gap-5 bg-gray-100">
              <div className="w-full">
                <h1 className="text-lg font-semibold mb-2">Reviews</h1>
              </div>
              <ReviewSection trustId={query.id as string} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRoute(TrustDetails);
