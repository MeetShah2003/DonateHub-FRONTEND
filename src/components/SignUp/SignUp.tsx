import { useFormik } from "formik";
import WelcomePage from "../WelcomePage";
import * as Yup from "yup";
import Link from "next/link";
import ShowPasswordIcon from "@/icons/ShowPasswordIcon";
import HidePasswordIcon from "@/icons/HidePasswordIcon";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL, MAX_LENGTH } from "@/consts";
import Spinner from "../Spinner";
import Image from "next/image";
import CameraIcon from "@/icons/CameraIcon";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Cookies from "js-cookie";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { inputLength, emailLength } = MAX_LENGTH;

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const SignupSchema = Yup.object().shape({
    firstName: Yup.string().trim().required("FirstName is required"),
    lastName: Yup.string().trim().required("LastName is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    userlogo: Yup.string().required("Please Upload Profile Image"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .trim()
      .required("Password is required"),
    gender: Yup.string().required("Please select a gender"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .trim()
      .required("Confirm Password is required"),
    mono: Yup.string()
      .matches(
        /^[+]?[0-9]+$/,
        "Mobile number must contain only digits and can optionally start with a '+'"
      )
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number can't exceed 15 digits")
      .trim()
      .required("Mobile Number is required"),
  });

  const initialValue: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    mono: string;
    gender: string;
    role: string;
    userlogo: string;
  } = {
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    mono: "",
    gender: "",
    role: "user",
    userlogo: "",
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    touched,
    errors,
    values,
  } = useFormik({
    initialValues: initialValue,
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const { confirmPassword, ...data } = values;

      if (values) {
        const signUpData = JSON.stringify(data);
        Cookies.set("signup-data", signUpData);
        fetch(`${BACKEND_BASE_URL}/api/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message == "user already exist") {
              errorToast("email already in use");
              setTimeout(() => {
                router.push("/login");
              }, 3000);
            } else if (data.message == "trust already exist") {
              errorToast("email already in use");
              setTimeout(() => {
                router.push("/login");
              }, 3000);
            } else {
              successToast("Otp Sent Successfully");
              setTimeout(() => {
                router.push("/signup/otpverification");
              }, 3000);
            }
          })
          .catch(() => {
            errorToast("something went wrong");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
  });

  const handleOnChange = async (e: any) => {
    if (e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      try {
        const imageUrl = await uploadToCloudinary(uploadedImage, "user-profile");

        if (imageUrl) {
          successToast("Image Upload Successfully");
          setFieldValue("userlogo", imageUrl);
        }
      } catch (error) {
        errorToast("Image Upload Failed");
      }
    }
  };
  return (
    <>
      <WelcomePage title="Welcome To" secondTitle="DonateHub">
        {loading && <Spinner />}
        <div className="max-h-[calc(100vh-2rem)] overflow-y-auto py-5">
          <form
            className="mx-auto w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] md:p-8"
            onSubmit={handleSubmit}
          >
            <div className="relative bottom-6 flex justify-center">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-primary p-1">
                <Image
                  alt="trustlogo"
                  src={values.userlogo}
                  className="h-full w-full rounded-full object-contain"
                  width={300}
                  height={200}
                ></Image>
              </div>
              <input
                type="file"
                id="userlogo"
                name="userlogo"
                accept="image/*"
                className="hidden"
                onChange={handleOnChange}
              />
              <div className="absolute bottom-0 left-1/2 z-50 translate-x-1/2">
                <label htmlFor="userlogo" className="cursor-pointer">
                  <CameraIcon />
                </label>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Join Now
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                Sign Up
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
                <label className="pb-1 text-sm font-medium text-slate-700">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  maxLength={inputLength}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none tracking-wider"
                  placeholder="John"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName}
                />
                {touched.firstName && errors.firstName && (
                  <span className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
                <label className="pb-1 text-sm font-medium text-slate-700">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  maxLength={inputLength}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none tracking-wider"
                  placeholder="Doe"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                />
                {touched.lastName && errors.lastName && (
                  <span className="mt-1 text-sm text-red-600">
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
              <label className="pb-1 text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                maxLength={emailLength}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full bg-transparent text-sm text-slate-900 outline-none tracking-wider"
                placeholder="johndoe@gmail.com"
              />
              {touched.email && errors.email && (
                <span className="mt-1 text-sm text-red-600">{errors.email}</span>
              )}
            </div>

            <div className="mt-4 flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
              <label className="pb-1 text-sm font-medium text-slate-700">Mobile No</label>
              <input
                id="mono"
                name="mono"
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={10}
                className="w-full bg-transparent text-sm text-slate-900 outline-none tracking-wider"
                placeholder="+91 9858888454"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value
                    .replace(/\D/, "")
                    .slice(0, 10);
                  handleChange(e);
                }}
              />
              {touched.mono && errors.mono && (
                <span className="mt-1 text-sm text-red-600">{errors.mono}</span>
              )}
            </div>

            <div className="mt-4 flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
              <label className="pb-1 text-sm font-medium text-slate-700">Gender</label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={values.gender === "male"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="male" className="ml-2 text-sm text-slate-700">
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={values.gender === "female"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="female" className="ml-2 text-sm text-slate-700">
                    Female
                  </label>
                </div>
              </div>
              {touched.gender && errors.gender && (
                <span className="mt-1 text-sm text-red-600">{errors.gender}</span>
              )}
            </div>

            <div className="mt-4 flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
              <label className="pb-1 text-sm font-medium text-slate-700">Password</label>
              <div className="flex items-center justify-between gap-2">
                <input
                  id="password"
                  maxLength={15}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none tracking-wider"
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
                <span className="mt-1 text-sm text-red-600">{errors.password}</span>
              )}
            </div>

            <div className="mt-4 flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
              <label className="pb-1 text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="text"
                maxLength={15}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full bg-transparent text-sm text-slate-900 outline-none tracking-wider"
                placeholder="••••••••"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className="mt-4 text-sm text-primary underline-offset-2 underline">
              <Link href={"/trustsignup"}>As a trust?</Link>
            </div>

            <div className="mt-5 flex flex-col rounded-2xl bg-primary px-2 py-3 shadow-sm">
              <button
                type="submit"
                className="text-sm font-semibold text-white"
              >
                Sign Up
              </button>
            </div>

            <div className="mt-4 flex justify-center text-sm text-slate-600">
              <p>
                Already have an account?{' '}
                <span className="text-primary underline-offset-2 underline">
                  <Link href={"/login"}>Login</Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </WelcomePage>
    </>
  );
};

export default SignUp;
