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

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

  const onSuccess = (response: any) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/api/trustDonate/${query?.trustId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId: response?.razorpay_payment_id,
        trustId: singleData?.tId._id,
        amount: values?.amount,
        disasterId: singleData?._id,
      }),
    })
      .then((res) => res.json())
      .then((data: SuccessTransaction) => {
        if (data) {
          const successTransaction = JSON.stringify(data);
          Cookies.set("successTransaction", successTransaction);
          successToast("Thank You For Donation");
          push(`/dashboard/${query.trustId}/showtransaction`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFailure = (response: any) => {
    errorToast("Last transaction was cancelled");
  };

  const { handleSubmit, handleChange, setValues, values, errors, touched } =
    useFormik({
      initialValues: {
        amount: null || 0,
      },
      validationSchema: amountValidationSchema,
      onSubmit: async (values) => {
        setLoading(true);
        const data = {
          amount: values.amount * 100,
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
            }),
          });
          const order = await response.json();

          var options = {
            key: "rzp_test_zfmhrR9Z3TReMH",
            amount: data.amount,
            currency: data.curruncy,
            name: "DonateHUB",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            handler: (response: any) => {
              if (response.razorpay_payment_id) {
                onSuccess(response);
              } else {
                onFailure(response);
              }
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
      <div className="max-w-full w-90% mx-auto my-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row w-full p-3 shadow-sm rounded-lg gap-5 bg-gray-100">
            <div className="w-full md:w-1/4 h-full rounded-lg">
              <Image
                src={singleData.disasterImage}
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
                  <p className="text-xl text-gray-500">{singleData?.title}</p>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Catagory</h1>
                  <p className="text-xl text-gray-500">
                    {singleData.tId?.category}
                  </p>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Founder</h1>
                  <p className="text-xl text-gray-500">
                    {singleData.tId?.founder}
                  </p>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Currunt Balance</h1>
                  <p className="text-xl text-gray-500">
                    ₹{formatAmount(singleData?.recievedFund)}
                  </p>
                </div>
              </div>
              <div className="w-3/4 flex flex-col gap-5">
                <div>
                  <h1 className="text-lg font-semibold">Email</h1>
                  <p className="text-xl text-gray-500">
                    {singleData.tId?.email}
                  </p>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Contact No</h1>
                  <p className="text-xl text-gray-500">
                    {singleData.tId?.contactNo}
                  </p>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Help No</h1>
                  <p className="text-xl text-gray-500">
                    {singleData.altContact}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full p-3 shadow-md rounded-lg gap-5 bg-gray-100">
            <div className="w-full">
              <h1 className="text-lg font-semibold">Description</h1>
              <p className="text-xl text-gray-500">{singleData?.description}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full bg-gray-100 shadow-md p-3 rounded-lg gap-5 ">
            <div className="flex flex-col gap-3 w-full">
              <h1 className="text-lg font-semibold">Progress</h1>
              <div className="w-full h-2 bg-primaryLight rounded-full">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full rounded-full bg-primary"
                ></div>
              </div>
              <div className="w-full  rounded-full">
                <div
                  style={{ marginLeft: `${progress}%` }}
                  className="h-full rounded-full"
                >
                  <div className="flex w-full justify-between">
                    <span className="bg-secondary rounded-lg p-2 text-white font-bold">
                      ₹{formatAmount(singleData?.recievedFund)}
                    </span>
                    <span className="bg-secondary rounded-lg p-2 text-white font-bold">
                      ₹{formatAmount(singleData?.targetFund)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full p-3 shadow-md rounded-lg gap-5 bg-gray-100">
            <div className="w-full gap-5">
              <h1 className="text-lg font-semibold mb-5">Address</h1>
              <div className="grid md:grid-cols-2 md:grid-rows-2 gap-5">
                <div>
                  <h1 className="text-base font-normal">Address</h1>
                  <p className="text-lg text-gray-500">
                    {singleData.tId?.address}
                  </p>
                </div>
                <div>
                  <h1 className="text-base font-normal">State</h1>
                  <p className="text-lg text-gray-500">
                    {singleData.tId?.state}
                  </p>
                </div>
                <div>
                  <h1 className="text-base font-normal">City</h1>
                  <p className="text-lg text-gray-500">
                    {singleData.tId?.city}
                  </p>
                </div>
                <div>
                  <h1 className="text-base font-normal">Pincode</h1>
                  <p className="text-lg text-gray-500">
                    {singleData.tId?.pincode}
                  </p>
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
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault(); // Prevent the default behavior of increasing/decreasing the value
                        }
                      }}
                      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const inputValue = e.target.value;
                        // Check if the first character is '0' or if all characters are '0'
                        if (inputValue === "0" || /^0+$/.test(inputValue)) {
                          e.target.value = ""; // Clear the input field
                        } else if (inputValue.length > 5) {
                          e.target.value = inputValue.slice(0, 5); // Limit to 5 characters
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
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRoute(TrustDetails);
