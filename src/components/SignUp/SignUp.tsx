import { useFormik } from "formik";
import WelcomePage from "../WelcomePage";
import * as Yup from "yup";
import Link from "next/link";
import ShowPasswordIcon from "@/icons/ShowPasswordIcon";
import HidePasswordIcon from "@/icons/HidePasswordIcon";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ToastMessage from "../ToastMessage";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const SignupSchema = Yup.object().shape({
    username: Yup.string().trim().required("Username is required"),
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const initialValue: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  } = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "user",
  };

  const { handleSubmit, handleChange, handleBlur, touched, errors, values } =
    useFormik({
      initialValues: initialValue,
      validationSchema: SignupSchema,
      onSubmit: async (values) => {
        const { confirmPassword, ...data } = values;
        try {
          fetch(`http://127.0.0.1:8090/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              if (data.message == "user already exist") {
                errorToast("user already exists");
                router.push("/login");
              } else {
                successToast("Account created successfully");
                router.push("/login");
              }
            });
        } catch (error) {
          console.log(error);
        }
      },
    });
  return (
    <WelcomePage>
      <ToastMessage />
      <form className="mx-5 lg:mx-20 gap-10" onSubmit={handleSubmit}>
        <h3 className="font-inter text-3xl drop-shadow-2xl tracking-wider font-bold mb-8">
          Sign Up
        </h3>
        <div className="flex flex-col border-2 px-2 py-1 rounded-t-lg focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            className="outline-none tracking-wider"
            placeholder="John Doe"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
          />
          {touched.username && errors.username && (
            <span className="text-sm text-red-600">{errors.username}</span>
          )}
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
  );
};

export default SignUp;
