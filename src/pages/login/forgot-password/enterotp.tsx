import React, { useState, useEffect } from "react";
import WelcomePage from "@/components/WelcomePage";
import { useFormik } from "formik";
import OtpInput from "react-otp-input";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const errorToast = (errorMessage: string) => toast.error(errorMessage);
const successToast = (successMessage: string) => toast.success(successMessage);

const EnterOtp = () => {
  const [resendTimer, setResendTimer] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

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
      try {
        setSubmitted(true);
        fetch(`http://localhost:8090/api/verify`, {
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
          });
      } catch (error) {
        console.log(error);
      }
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
    // Add logic here to resend OTP
    setResendTimer(60); // Reset timer to initial value
    fetch(`http://localhost:8090/api/resendEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(),
    });
  };

  return (
    <WelcomePage title="Reset" secondTitle="Password">
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

export default EnterOtp;
