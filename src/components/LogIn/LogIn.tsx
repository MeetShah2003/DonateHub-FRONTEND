import { useFormik } from "formik";
import Link from "next/link";
import Cookies from "js-cookie";
import WelcomePage from "../WelcomePage";
import GoogleIcon from "@/icons/GoogleIcon";
import GithubIcon from "@/icons/GithubIcon";
import * as Yup from "yup";
import FacebookIcon from "@/icons/FacebookIcon";
import HidePasswordIcon from "@/icons/HidePasswordIcon";
import ShowPasswordIcon from "@/icons/ShowPasswordIcon";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ToastMessage from "../ToastMessage";
import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import { useGoogleLogin } from "@react-oauth/google";

const initialValue: {
  email: string;
  password: string;
} = {
  email: "",
  password: "",
};

const loginSchema = Yup.object().shape({
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
});

const LogIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const token = Cookies.get("access_token");

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  // const googleLogin= async (response) => {
  //   try {
  //     if (response.tokenId) {
  //       const userResponse = await fetch("http://127.0.0.1:8090/google/auth", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ tokenId: response.tokenId }),
  //       });

  //       const userLogin = await userResponse.json();

  //       if (userLogin.token) {
  //         alert("Login Successful...!");
  //         window.location.href = "/";
  //       } else {
  //         alert("Login Failed...!");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     alert("Login failed. Try again later...!");
  //   }
  // };

  // const googleLogin = async (response: any) => {
  //   try {
  //     console.log("Google Login Response:", response);

  //     // Check the console log to understand the structure of the response object

  //     if (response.tokenId) {
  //       const userResponse = await fetch("http://127.0.0.1:8090/google/auth", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ tokenId: response.tokenId }),
  //       });

  //       const userLogin = await userResponse.json();

  //       if (userLogin.token) {
  //         successToast("Login Successful...!");
  //         window.location.href = "/";
  //       } else {
  //         errorToast("Login Failed...!");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     errorToast("Login Failed...!");
  //   }
  // };

  const gLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        })
          .then((response) => response.json())
          .then((userInfo) => {
            console.log("User Information:", userInfo);
          })
          .catch((error) => {
            console.error("Error fetching user information:", error);
          });
      } catch (err) {
        console.log(err);
      }
    },
  });
  const { handleChange, handleSubmit, handleBlur, errors, touched } = useFormik(
    {
      initialValues: initialValue,
      validationSchema: loginSchema,
      onSubmit: async (values) => {
        console.log(values);
        try {
          fetch("http://localhost:8090/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.message == "login sucessfull") {
                successToast(`Welcome back ${data.user.username}`);
                Cookies.set("access_token", data.token, {
                  expires: 7,
                  path: "/",
                });
                router.push("/dashboard");
              } else {
                if (data.message == "user not found") {
                  errorToast("Email not found");
                }
                if (data.message == "invalid password") {
                  errorToast("Invalid password");
                } else {
                  errorToast("Login failed");
                }
              }
            });
        } catch (error) {
          console.log(error);
        }
      },
    }
  );
  return (
    <WelcomePage>
      <ToastMessage />
      <form className="mx-5 lg:mx-20 gap-10" onSubmit={handleSubmit}>
        <h3 className="font-inter text-3xl drop-shadow-2xl tracking-wider font-bold mb-8">
          Sign in
        </h3>
        <div className="flex flex-col border-2 px-2 py-1 rounded-t-lg focus-within:border-primary">
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
        <div className="flex flex-col border-t-transparent rounded-b-lg border-2 px-2 py-1 focus-within:border-primary">
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
        <div className="flex flex-col border-2 mt-5 bg-primary shadow-sm rounded-lg px-2 py-2">
          <button
            type="submit"
            className="outline-none text-white font-inter font-medium"
          >
            Sign In
          </button>
        </div>
        {/* <div className="flex flex-col border-2 mt-4 shadow-sm rounded-lg px-2 py-2">
          <button
            type="button"
            className="outline-none flex justify-center gap-3 text-black font-inter font-medium"
          >
            <span>
              <GoogleIcon />
            </span>
            Continue with Google
          </button>
        </div> */}
        {/* <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        /> */}
        <div className="flex flex-col border-2 mt-4 shadow-sm rounded-lg px-2 py-2">
          <button
            type="button"
            onClick={() => {
              gLogin();
            }}
            className="outline-none flex justify-center gap-3 text-black font-inter font-medium"
          >
            <span>
              <GoogleIcon />
            </span>
            Continue with Google
          </button>
        </div>
        <div className="flex flex-col border-2 mt-4 shadow-sm rounded-lg px-2 py-2">
          <button
            type="button"
            className="outline-none flex justify-center gap-3 text-black font-inter font-medium"
          >
            <span>
              <FacebookIcon />
            </span>
            Continue with Facebook
          </button>
        </div>
        <div className="flex flex-col border-2 mt-4 shadow-sm rounded-lg px-2 py-2">
          <button
            type="button"
            className="outline-none flex justify-center gap-3 text-black font-inter font-medium"
          >
            <span>
              <GithubIcon />
            </span>
            Continue with GitHub
          </button>
        </div>
        <div className="my-3 flex justify-center ">
          <p>
            Not a registered user yet?
            <span className="text-primary underline-offset-2 underline">
              <Link href={"/"}>SignUp</Link>
            </span>
          </p>
        </div>
      </form>
    </WelcomePage>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default LogIn;
