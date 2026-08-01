import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { SingleFundRequirement, SuccessTransaction } from "@/types/types";
import { BACKEND_BASE_URL } from "@/consts";
import Spinner from "@/components/Spinner";
import UserRoute from "@/components/UserRoute/UserRoute";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/auth";
import Visitor from "@/components/Visitor";
import RuppeSymbol from "@/icons/RuppeSymbol";
import { toast } from "react-toastify";
import { openRazorpayCheckout } from "@/lib/razorpay";

const TrustDetails = () => {
  const [singleData, setSingleData] = useState<SingleFundRequirement>();
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const { query } = useRouter();
  const { user } = useAuth();
  const access_token = Cookies.get("access_token");

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const amountValidationSchema = Yup.object().shape({
    amount: Yup.number().required("Amount is required"),
  });

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
      const data = (await verifyRes.json()) as SuccessTransaction & {
        message?: string;
      };
      if (!verifyRes.ok) {
        throw new Error(data?.message || "Payment verification failed");
      }
      const successTransaction = JSON.stringify(data);
      Cookies.set("successTransaction", successTransaction);
      successToast("Thank You For Donation");
      push(`/dashboard/${query.trustId}/showtransaction`);
    } catch (error: any) {
      errorToast(error.message || "Payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  const onFailure = () => {
    errorToast("Last transaction was cancelled");
  };

  const { handleSubmit, handleChange, setValues, values, errors, touched } =
    useFormik({
      initialValues: {
        amount: 0,
      },
      validationSchema: amountValidationSchema,
      onSubmit: async (values) => {
        setLoading(true);
        const data = {
          amount: values.amount,
          curruncy: "INR",
          trustId: singleData?.tId?._id,
        };
        try {
          const response = await fetch(`${BACKEND_BASE_URL}/api/donateCreate`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: data.amount,
              currency: data.curruncy,
              donationType: "disaster",
              trustId: singleData?.tId?._id,
              disasterId: singleData?._id,
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
            name: "DonateHUB",
            description: "Donation for disaster support",
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
        } catch (error) {
          errorToast("Something went wrong");
        } finally {
          setLoading(false);
        }
      },
    });

  useEffect(() => {
    const getSingleTrustData = async (id: string) => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/fundRequest/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setSingleData(data.singleTrust);
        }
      } catch (error) {
        errorToast("Something went wrong");
      }
    };

    if (query.trustId) {
      getSingleTrustData(query.trustId as string);
    }
  }, [query.trustId, access_token]);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  if (!singleData || loading) {
    return <Spinner />;
  }

  const progress =
    ((singleData?.recievedFund as number) / singleData?.targetFund) * 100;

  return (
    <>
      <div className="navbar sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      <div className="mx-auto max-w-6xl w-[90%] py-8 md:py-10">
        <div className="mb-6 rounded-[30px] bg-gradient-to-r from-violet-700 via-primary to-fuchsia-600 p-[1px] shadow-[0_25px_70px_-30px_rgba(109,40,217,0.7)]">
          <div className="rounded-[29px] bg-white/95 px-5 py-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Disaster donation
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{singleData?.title}</h1>
              </div>
              <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-primary">
                {singleData.nUniqueSupporters} supporters
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid gap-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[24px]">
              <Image
                src={singleData.disasterImage}
                width={500}
                height={300}
                className="h-full w-full rounded-[24px] object-cover"
                alt={"trustLogo"}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Disaster Name</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData?.title}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Category</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.tId?.category}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Founder</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.tId?.founder}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Current Balance</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">₹{formatAmount(singleData?.recievedFund)}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Email</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.tId?.email}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Contact No</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.tId?.contactNo}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Help No</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.altContact}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="text-lg font-semibold text-slate-900">Description</h1>
            <p className="mt-3 text-base leading-8 text-slate-600">{singleData?.description}</p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="mb-4 text-lg font-semibold text-slate-900">Progress</h1>
            <div className="h-3 overflow-hidden rounded-full bg-primaryLight">
              <div style={{ width: `${progress}%` }} className="h-full rounded-full bg-primary"></div>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="rounded-2xl bg-secondary px-3 py-2 text-sm font-semibold text-white">
                ₹{formatAmount(singleData?.recievedFund)} raised
              </span>
              <span className="rounded-2xl bg-secondary px-3 py-2 text-sm font-semibold text-white">
                ₹{formatAmount(singleData?.targetFund)} target
              </span>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="mb-4 text-lg font-semibold text-slate-900">Address</h1>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Address</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.tId?.address}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">State</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.tId?.state}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">City</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.tId?.city}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Pincode</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.tId?.pincode}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-3/4">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <RuppeSymbol />
                  </span>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    maxLength={7}
                    value={values.amount}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 py-3 text-slate-900 outline-none transition focus:border-primary focus:bg-white"
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
                    <div className="mt-2 text-red-500">{errors.amount}</div>
                  ) : null}
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  Donate Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRoute(TrustDetails);
