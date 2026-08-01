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
      <div className="mx-auto max-w-6xl w-[90%] py-8 md:py-10">
        <div className="mb-6 rounded-[30px] bg-gradient-to-r from-violet-700 via-primary to-fuchsia-600 p-[1px] shadow-[0_25px_70px_-30px_rgba(109,40,217,0.7)]">
          <div className="rounded-[29px] bg-white/95 px-5 py-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Trust donation
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{singleData.trustName}</h1>
              </div>
              <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-primary">
                Support verified trust
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid gap-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[24px]">
              <Image
                src={singleData.trustlogo}
                width={500}
                height={300}
                className="h-full w-full rounded-[24px] object-cover"
                alt={"trustLogo"}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Trust Name</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.trustName}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Category</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.category}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Founder</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.founder}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Current Balance</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">₹{formatAmount(singleData.manualDonation)}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Email</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.email}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Contact No</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.contactNo}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="text-lg font-semibold text-slate-900">Description</h1>
            <p className="mt-3 text-base leading-8 text-slate-600">{singleData.description}</p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="mb-4 text-lg font-semibold text-slate-900">Address</h1>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Address</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.address}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">State</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.state}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">City</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.city}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Pincode</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{singleData.pincode}</p>
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
                    value={values.amount as number}
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

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="mb-3 text-lg font-semibold text-slate-900">Suggestions</h1>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {[
                100,
                500,
                1000,
                1500,
                2000,
                2500,
                3000,
                5000,
                15000,
                20000,
                25000,
              ].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setValues({ amount });
                  }}
                  type="button"
                  className="rounded-2xl border border-primary bg-white px-3 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-primary hover:bg-violet-50"
                >
                  ₹{amount.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="mb-3 text-lg font-semibold text-slate-900">Reviews</h1>
            <ReviewSection trustId={query.id as string} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRoute(TrustDetails);
