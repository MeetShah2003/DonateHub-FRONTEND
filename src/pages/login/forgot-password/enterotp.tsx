import React, { useState, useEffect } from "react";
import WelcomePage from "@/components/WelcomePage";
import { useFormik } from "formik";
import Link from "next/link";
import OtpInput from "react-otp-input";

const EnterOtp = () => {
  const [resendTimer, setResendTimer] = useState(60); // Set initial timer value in seconds
  const { handleChange, handleSubmit, values } = useFormik({
    initialValues: {
      otp: "",
    },
    onSubmit: () => {
      console.log(values);
    },
  });

  useEffect(() => {
    let interval;

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
          separator={<span className="mx-2"></span>}
          isInputNum={true}
          placeholder="0000"
          containerStyle="flex justify-center"
          renderInput={(props, index) => (
            <input
              {...props}
              key={index}
              className="border-2 border-gray-300 focus:border-primary"
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
