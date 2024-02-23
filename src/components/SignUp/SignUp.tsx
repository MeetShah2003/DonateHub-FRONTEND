import { useFormik } from "formik";
import WelcomePage from "../WelcomePage";
import * as Yup from "yup";
import Link from "next/link";
import ShowPasswordIcon from "@/icons/ShowPasswordIcon";
import HidePasswordIcon from "@/icons/HidePasswordIcon";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "@/consts";
import Spinner from "../Spinner";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    gender: Yup.string().required("Please select a gender"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
    mobileno: Yup.string()
      .matches(
        /^[+]?[0-9]+$/,
        "Mobile number must contain only digits and can optionally start with a '+'"
      )
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number can't exceed 15 digits")
      .required("Mobile Number is required"),
  });

  const initialValue: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    mobileno: string;
    gender: string;
    role: string;
  } = {
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    mobileno: "",
    gender: "",
    role: "user",
  };

  const { handleSubmit, handleChange, handleBlur, touched, errors, values } =
    useFormik({
      initialValues: initialValue,
      validationSchema: SignupSchema,
      onSubmit: async (values) => {
        setLoading(true);
        const { confirmPassword, ...data } = values;
        try {
          fetch(`${BACKEND_BASE_URL}/api/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data && data.message == "user already exist") {
                errorToast("user already exists");
                setTimeout(() => {
                  router.push("/login");
                }, 3000);
              } else {
                successToast("Account created successfully");
                setTimeout(() => {
                  router.push("/login");
                }, 3000);
              }
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              setLoading(false);
            });
        } catch (error) {
          console.log(error);
        }
      },
    });
  return (
    <>
      <WelcomePage title="Welcome To" secondTitle="DonateHub">
        {loading && <Spinner />}
        <form className="mx-5 lg:mx-20 gap-10" onSubmit={handleSubmit}>
          <h3 className="font-inter text-3xl drop-shadow-2xl tracking-wider font-bold mb-8">
            Sign Up
          </h3>
          <div className="flex w-full">
            <div className="flex w-1/2 flex-col border-2 px-2 py-1 rounded-tl-lg focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="outline-none tracking-wider"
                placeholder="John"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
              />
              {touched.firstName && errors.firstName && (
                <span className="text-sm text-red-600">{errors.firstName}</span>
              )}
            </div>
            <div className="flex w-1/2 flex-col border-2 border-l-transparent px-2 py-1 rounded-tr-lg focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="outline-none tracking-wider"
                placeholder="Doe"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
              />
              {touched.lastName && errors.lastName && (
                <span className="text-sm text-red-600">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col border-t-transparent border-2 px-2 py-1 focus-within:border-primary">
            <label className="pb-1 text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              className="outline-none tracking-wider"
              placeholder="johndoe@gmail.com"
            />
            {touched.email && errors.email && (
              <span className="text-sm text-red-600">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col border-t-transparent border-2 px-2 py-1 focus-within:border-primary">
            <label className="pb-1 text-sm font-medium">Mobile No</label>
            <input
              id="mobileno"
              name="mobileno"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              className="outline-none tracking-wider"
              placeholder="+91 9858888454"
            />
            {touched.mobileno && errors.mobileno && (
              <span className="text-sm text-red-600">{errors.mobileno}</span>
            )}
          </div>
          <div className="flex flex-col border-t-transparent border-2 px-2 py-1 focus-within:border-primary">
            <label className="pb-1 text-sm font-medium">Gender</label>
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
                <label htmlFor="male" className="ml-2">
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
                <label htmlFor="female" className="ml-2">
                  Female
                </label>
              </div>
              {/* Add more gender options if needed */}
            </div>
            {touched.gender && errors.gender && (
              <span className="text-sm text-red-600">{errors.gender}</span>
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
          <div className="flex flex-col border-t-transparent border-2 rounded-b-lg px-2 py-1 focus-within:border-primary">
            <label className="pb-1 text-sm font-medium">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              className="outline-none tracking-wider"
              placeholder="••••••••"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="text-sm text-red-600">
                {errors.confirmPassword}
              </span>
            )}
          </div>
          <div className="my-3 text-primary underline-offset-2 underline">
            <Link href={"/trustsignup"}>As a trust?</Link>
          </div>
          <div className="flex flex-col border-2 mt-2 bg-primary shadow-sm rounded-lg px-2 py-2">
            <button
              type="submit"
              className="outline-none text-white font-inter font-medium"
            >
              Sign Up
            </button>
          </div>
          <div className="my-3 flex justify-center ">
            <p>
              Already have an account?
              <span className="text-primary underline-offset-2 underline">
                <Link href={"/login"}>Login</Link>
              </span>
            </p>
          </div>
        </form>
      </WelcomePage>
    </>
  );
};

export default SignUp;
