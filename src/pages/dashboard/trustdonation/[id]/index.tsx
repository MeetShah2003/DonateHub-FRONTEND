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
import { toast } from "react-toastify";
import { openRazorpayCheckout } from "@/lib/razorpay";

const TrustDetails = () => {
  const [singleData, setSingleData] = useState<TrustData>();
  const [loading, setLoading] = useState(false);
  const { query } = useRouter();
  const { user } = useAuth();
  const access_token = Cookies.get("access_token");
  const { push } = useRouter();

  const amountValidationSchema = Yup.object().shape({
    amount: Yup.number().required("Amount is required"),
  });

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

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
      errorToast("Something went wrong");
    }
  };

  const onSuccess = async (response: any) => {
    setLoading(true);
    try {
      const verifyRes = await fetch(`${BACKEND_BASE_URL}/api/verify-payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_payment_id: response?.razorpay_payment_id,
          razorpay_order_id: response?.razorpay_order_id,
          razorpay_signature: response?.razorpay_signature,
        }),
      });
      const data = (await verifyRes.json()) as { message?: string; userTransaction?: any };
      if (!verifyRes.ok) {
        throw new Error(data?.message || "Payment verification failed");
      }
      getSingleTrustData(query.id as string);
      const successTransaction = JSON.stringify(data.userTransaction);
      Cookies.set("successTransaction", successTransaction);
      successToast("Thank You For Donation");
      push(`/dashboard/trustdonation/${query.id}/showtransaction`);
    } catch (error: any) {
      errorToast(error.message || "Payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  const onFailure = () => {
    errorToast("Last transaction was cancelled");
  };

  const initialValues: { amount: number | null } = {
    amount: null,
  };

  const { handleSubmit, handleChange, setValues, values, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: amountValidationSchema,
      onSubmit: async (values) => {
        const data = {
          amount: values.amount,
          curruncy: "INR",
          trustId: query.id,
        };
        const response = await fetch(`${BACKEND_BASE_URL}/api/donateCreate`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: data.amount,
            currency: data.curruncy,
            donationType: "manual",
            trustId: data.trustId,
          }),
        });
        const orderPayload = await response.json();
        if (!response.ok) {
          throw new Error(orderPayload.message || "Unable to create donation order");
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderPayload.order.amount,
          currency: data.curruncy,
          name: "DonateHub",
          description: "Trust donation",
          image: "/images/donatehublogo.png",
          order_id: orderPayload.order.id,
          handler: (response: any) => {
            if (response.razorpay_payment_id) {
              onSuccess(response);
            } else {
              onFailure();
            }
          },
          prefill: {
            name: `${user?.firstName || "Donor"} ${user?.lastName || ""}`.trim(),
            email: user?.email || "",
            contact: user?.mono || "",
          },
          theme: {
            color: "#674CC4",
          },
        };

        await openRazorpayCheckout(options);
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

  return (
    <>
      <div className="navbar sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      {loading && <Spinner />}
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
                      value={values.amount as number}
                      onChange={handleChange}
                      className="w-full border border-primary outline-none rounded-lg pl-10 p-2"
                      placeholder="Enter Amount"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const inputValue = e.target.value;

                        if (inputValue === "0" || /^0+$/.test(inputValue)) {
                          e.target.value = "";
                        } else if (inputValue.length > 5) {
                          e.target.value = inputValue.slice(0, 5);
                        }
                      }}
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
