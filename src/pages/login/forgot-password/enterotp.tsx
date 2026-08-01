import React, { useState, useEffect } from "react";
import WelcomePage from "@/components/WelcomePage";
import { useFormik } from "formik";
import OtpInput from "react-otp-input";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import Spinner from "@/components/Spinner";

const errorToast = (errorMessage: string) => toast.error(errorMessage);
const successToast = (successMessage: string) => toast.success(successMessage);

const EnterOtp = () => {
  const [resendTimer, setResendTimer] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const forgotPasswordEmail = Cookies.get(`forgotPasswordEmail`);

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .length(4, "OTP must be exactly 4 characters")
      .matches(/^\d+$/, "OTP must only contain digits")
      .required("OTP is required"),
  });

  const { handleChange, handleSubmit, errors, values, touched } = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      setSubmitted(true);
      fetch(`${BACKEND_BASE_URL}/api/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Correct OTP") {
            successToast("Otp verified");
            setTimeout(() => {
              router.push("/login/forgot-password/newpassword");
            }, 3000);
          } else if (data.message === "In-Correct OTP") {
            errorToast("Wrong Otp");
          } else {
            errorToast("Something went wrong");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    var interval: any;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendOtp = () => {
    setLoading(true);
    setResendTimer(2);
    fetch(`${BACKEND_BASE_URL}/api/resendEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: forgotPasswordEmail }),
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <WelcomePage title="Reset" secondTitle="Password">
      {loading && <Spinner />}
      <form
        className="mx-auto w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] md:p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Verification
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            Enter Otp
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Please enter the verification code sent to your email.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <OtpInput
            value={values.otp}
            onChange={(otp) =>
              handleChange({ target: { name: "otp", value: otp } })
            }
            numInputs={4}
            placeholder="0000"
            containerStyle="flex justify-center gap-2"
            renderInput={(props, index) => (
              <input
                {...props}
                key={index}
                className={`h-11 w-11 rounded-xl border text-center text-base outline-none ${
                  errors.otp && (touched.otp || submitted)
                    ? "border-red-600"
                    : "border-slate-300"
                } focus:border-primary`}
                name="otp"
                id="otp"
              />
            )}
          />
          {errors.otp && (touched.otp || submitted) && (
            <div className="mt-3 text-sm text-red-600">{errors.otp}</div>
          )}
        </div>

        <div className="mt-5 flex flex-col rounded-2xl bg-primary px-2 py-3 shadow-sm">
          <button
            type="submit"
            className="text-sm font-semibold text-white"
          >
            Submit
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          {resendTimer === 0 ? (
            <p
              className="cursor-pointer text-sm text-slate-500 hover:text-primary"
              onClick={handleResendOtp}
            >
              Resend Otp
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              Resend Otp in {resendTimer} seconds
            </p>
          )}
        </div>
      </form>
    </WelcomePage>
  );
};

export default EnterOtp;
