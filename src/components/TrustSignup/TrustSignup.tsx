import Link from "next/link";
import WelcomePage from "../WelcomePage";
import { useFormik } from "formik";
import CameraIcon from "@/icons/CameraIcon";
import * as Yup from "yup";
import HidePasswordIcon from "@/icons/HidePasswordIcon";
import ShowPasswordIcon from "@/icons/ShowPasswordIcon";
import { useState } from "react";

const TrustSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const initialValue: {
    trustname: string;
    trustlogo: string;
    trustemail: string;
    founder: string;
    creationdate: Date;
    catagory: string;
    contactno: number;
    abouttrust: string;
    password: string;
    role: string;
  } = {
    trustname: "",
    trustemail: "",
    trustlogo: "",
    founder: "",
    creationdate: new Date(2023, 0, 1),
    catagory: "",
    contactno: 0,
    abouttrust: "",
    password: "",
    role: "trust",
  };

  const trustDetailSchema = Yup.object().shape({
    trustname: Yup.string().trim().required("Trust Name is required"),
    trustlogo: Yup.string().trim().required("Trust Logo is required"),
    trustemail: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    founder: Yup.string().trim().required("Founder is required"),
    creationdate: Yup.date().required("Creation Date is required"),
    catagory: Yup.string().trim().required("Category is required"),
    contactno: Yup.number().required("Contact Number is required"),
    abouttrust: Yup.string().trim().required("About Trust is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    role: Yup.string()
      .trim()
      .oneOf(["trust"], "Invalid Role")
      .required("Role is required"),
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    isValid,
  } = useFormik({
    initialValues: initialValue,
    validationSchema: trustDetailSchema,
    onSubmit: () => {
      console.log(values);
    },
  });

  const handleNext = () => {
    if (isValid) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <WelcomePage>
      <div className="mx-5 lg:mx-20 mb-10 flex flex-col justify-center items-center gap-8">
        <div className="relative bottom-6">
          <div className="border-4 h-32 w-32 p-1 border-primary rounded-full overflow-hidden">
            <img
              className="rounded-full h-full w-full object-contain"
              src="https://tse1.mm.bing.net/th?id=OIP.ZNqde0PLHfVg1j1I-2G9xQHaHa&pid=Api&P=0&h=180"
              alt=""
            />
          </div>
          <div className="absolute z-50  left-1/2 bottom-0 translate-x-1/2 ">
            <CameraIcon />
          </div>
        </div>
        <div className="w-full flex justify-around">
          <div className="h-8 w-8 flex items-center justify-center font-bold rounded-full text-white bg-primary">
            1
          </div>
          <div>━━━━━━━━━━━━━━━</div>
          <div className="h-8 w-8 flex items-center justify-center font-bold rounded-full text-primary border border-primary bg-white">
            2
          </div>
          <div>━━━━━━━━━━━━━━━</div>

          <div className="h-8 w-8 flex items-center justify-center font-bold rounded-full text-primary border border-primary bg-white">
            3
          </div>
        </div>
      </div>
      <form className="mx-5 lg:mx-20 gap-10" onSubmit={handleSubmit}>
        {/* <h3 className="font-inter text-3xl drop-shadow-2xl tracking-wider font-bold mb-8">
          Sign Up
        </h3> */}
        <div className="flex flex-col border-2 px-2 py-1 rounded-t-lg focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Trust Name</label>
          <input
            id="trustname"
            name="trustname"
            type="text"
            className="outline-none tracking-wider"
            placeholder="The Education Trust"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.trustname}
          />
          {touched.trustname && errors.trustname && (
            <span className="text-sm text-red-600">{errors.trustname}</span>
          )}
        </div>
        <div className="flex flex-col border-2 px-2 py-1 border-t-transparent focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Trust Email</label>
          <input
            id="trustemail"
            name="trustemail"
            type="text"
            className="outline-none tracking-wider"
            placeholder="education@donation.com"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.trustemail}
          />
          {touched.trustemail && errors.trustemail && (
            <span className="text-sm text-red-600">{errors.trustemail}</span>
          )}
        </div>
        <div className="flex flex-col border-t-transparent border-2 px-2 py-1 focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Password</label>
          <div className="flex justify-between">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              onBlur={handleBlur}
              className="outline-none tracking-wider w-full"
              placeholder="••••••••"
            />
            <div
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
            </div>
          </div>
          {touched.password && errors.password && (
            <span className="text-sm text-red-600">{errors.password}</span>
          )}
        </div>
        <div className="flex flex-col border-2 px-2 py-1 border-t-transparent rounded-b-lg focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">About Trust</label>
          <textarea
            id="abouttrust"
            name="abouttrust"
            className="outline-none tracking-wider resize-none"
            rows={4}
            cols={30}
            placeholder="Type Here About Trust"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.abouttrust}
          />
          {touched.abouttrust && errors.abouttrust && (
            <span className="text-sm text-red-600">{errors.abouttrust}</span>
          )}
        </div>

        {/* <div className="flex flex-col border-t-transparent border-2 px-2 py-1 rounded-b-lg focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Role</label>
          <select
            className="outline-none tracking-wider"
            id="role"
            name="role"
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="user">User</option>
            <option value="trust">Trust</option>
          </select>
        </div> */}
        <div className="flex flex-col border-2 mt-2 bg-primary shadow-sm rounded-lg px-2 py-2">
          <button
            type="submit"
            className="outline-none text-white font-inter font-medium"
          >
            Next
          </button>
        </div>
      </form>
    </WelcomePage>
  );
};

export default TrustSignup;
