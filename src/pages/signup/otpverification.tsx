import React, { useState, useEffect } from "react";
import WelcomePage from "@/components/WelcomePage";
import { useFormik } from "formik";
import OtpInput from "react-otp-input";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "@/consts";
import Spinner from "@/components/Spinner";
import Cookies from "js-cookie";

const errorToast = (errorMessage: string) => toast.error(errorMessage);
const successToast = (successMessage: string) => toast.success(successMessage);

const OtpVerification = () => {
  const [resendTimer, setResendTimer] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const cookieSignUpData = Cookies.get("signup-data");
  const sigUpData = cookieSignUpData ? JSON.parse(cookieSignUpData) : null;

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
      const finalSignUpData = { otp: values.otp, ...sigUpData };

      fetch(`${BACKEND_BASE_URL}/api/OTPV`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalSignUpData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Account created sucessfully") {
            successToast("Otp verified");
            successToast("Account created successfully");
            setTimeout(() => {
              router.push("/login");
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

  const { role, ...withouteRoleData } = sigUpData || {};
  const { firstName, lastName, password, email, mono, gender, userlogo } =
    withouteRoleData;

  console.log(role);

  const resendOtpData = {
    otp: values?.otp,
    firstName,
    lastName,
    password,
    email,
    mono,
    gender,
    userlogo,
  };

  console.log(resendOtpData);

  const handleResendOtp = () => {
    setLoading(true);
    setResendTimer(2);
    fetch(`${BACKEND_BASE_URL}/api/ROTPV`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <WelcomePage title="Otp" secondTitle="Verification">
      {loading && <Spinner />}
      <form className="mx-5 lg:mx-20 py-10 gap-20" onSubmit={handleSubmit}>
        <h3 className="font-inter text-3xl drop-shadow-2xl tracking-wider font-bold mb-1">
          Enter Otp
        </h3>
        <p className="mb-5 text-steelGray">
          Please enter the verification code sent to your email
        </p>
        <OtpInput
          value={values.otp}
          onChange={(otp) =>
            handleChange({ target: { name: "otp", value: otp } })
          }
          numInputs={4}
          placeholder="0000"
          containerStyle="flex justify-center"
          renderInput={(props, index) => (
            <input
              {...props}
              key={index}
              className={`border-2 ${
                errors.otp && (touched.otp || submitted)
                  ? "border-red-600"
                  : "border-gray-300"
              } focus:border-primary`}
              name="otp"
              id="otp"
              style={{
                flex: 1,
                width: "40px",
                height: "40px",
                fontSize: "16px",
                margin: "0 5px",
                textAlign: "center",
                borderRadius: "4px",
                outline: "none",
              }}
            />
          )}
        />
        {errors.otp && (touched.otp || submitted) && (
          <div className="text-red-600">{errors.otp}</div>
        )}

        <div className="flex mt-5 flex-col border-2 bg-primary shadow-sm rounded-lg px-2 py-2">
          <button
            type="submit"
            className="outline-none text-white font-inter font-medium"
          >
            Submit
          </button>
        </div>

        <div className="my-5 flex justify-center">
          {resendTimer === 0 ? (
            <p
              className="text-steelGray cursor-pointer"
              onClick={handleResendOtp}
            >
              Resend Otp
            </p>
          ) : (
            <p className="text-steelGray">
              Resend Otp in {resendTimer} seconds
            </p>
          )}
        </div>
      </form>
    </WelcomePage>
  );
};

export default OtpVerification;
