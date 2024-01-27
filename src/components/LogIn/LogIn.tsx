import { useFormik } from "formik";
import Link from "next/link";
import Cookies from "js-cookie";
import WelcomePage from "../WelcomePage";
import GoogleIcon from "@/icons/GoogleIcon";
import GithubIcon from "@/icons/GithubIcon";
import * as Yup from "yup";
import HidePasswordIcon from "@/icons/HidePasswordIcon";
import ShowPasswordIcon from "@/icons/ShowPasswordIcon";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import { useGoogleLogin } from "@react-oauth/google";
import { useSession, signIn, signOut } from "next-auth/react";
import { useAuth } from "@/context/auth";
import { BACKEND_BASE_URL } from "@/consts";
// import { useUser } from "@/context/user";

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
  // const { setUserData, setAccessToken } = useUser();
  const { login, isAuthenticated, user } = useAuth();

  const { data: session } = useSession();

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const gLogin = useGoogleLogin({
    onSuccess: async (response) => {
      console.log(response);

      const userData = Cookies.get("user_data");
      try {
        fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${(response.access_token, userData)}`,
          },
        })
          .then((response) => response.json())
          .then((userInfo) => {
            if (userInfo) {
              fetch(`${BACKEND_BASE_URL}/api/googleData`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInfo),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (!data) {
                    errorToast("Something went wrong");
                  }
                  if (data.message === "login sucessfull") {
                    successToast(`Welcome Back ${data.user.username}`);
                    Cookies.set("user_data", data.user, {
                      expires: 7,
                      path: "/",
                    });
                    setTimeout(() => {
                      router.push("/dashboard");
                    }, 3000);
                  }
                  if (data.message === "account created sucessfull") {
                    successToast(`Welcome Back ${data.user.username}`);
                    Cookies.set("user_data", data.user, {
                      expires: 7,
                      path: "/",
                    });
                    setTimeout(() => {
                      router.push("/dashboard");
                    }, 3000);
                  }
                });
            } else {
              errorToast("something went wrong");
            }
          })
          .catch((error) => {
            console.error("Error fetching user information:", error);
          });
      } catch (err) {
        console.log(err);
      }
    },
  });

  useEffect(() => {
    if (isAuthenticated && user && !user.isBlocked) {
      console.log("Login successful!", isAuthenticated);
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      successToast(`Welcome ${user.firstName} ${user.lastName}`);
    } else {
      if (user?.isBlocked) {
        errorToast("You Are Blocked");
      }
    }
  }, [isAuthenticated, user]);
  const { handleChange, handleSubmit, handleBlur, errors, touched } = useFormik(
    {
      initialValues: initialValue,
      validationSchema: loginSchema,
      onSubmit: async (values) => {
        // try {
        //   fetch("http://localhost:8090/api/login", {
        //     method: "POST",
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(values),
        //   })
        //     .then((res) => res.json())
        //     .then((data) => {
        //       console.log(data);

        //       if (data.message == "login sucessfull") {
        //         // setUserData(data);
        //         Cookies.set("user_data", data.token, {
        //           expires: 7,
        //           path: "/",
        //         });
        //         // setAccessToken(data.token);
        //         if (data.user.role === "admin") {
        //           // setUserData(data);
        //           Cookies.set("user_data", data.token, {
        //             expires: 7,
        //             path: "/",
        //           });
        //           successToast(
        //             `Welcome ${data.user.firstName} ${data.user.lastName}`
        //           );
        //           // Cookies.set("access_token", data.token, {
        //           //   expires: 7,
        //           //   path: "/",
        //           // });
        //           setTimeout(() => {
        //             router.push("/admin");
        //           }, 3000);
        //         } else {
        //           successToast(
        //             `Welcome ${data.user.firstName} ${data.user.lastName}`
        //           );
        //           Cookies.set("user_data", data.token, {
        //             expires: 7,
        //             path: "/",
        //           });
        //           setTimeout(() => {
        //             router.push("/dashboard");
        //           }, 3000);
        //         }
        //       } else {
        //         if (data.message == "user not found") {
        //           errorToast("Email not found");
        //         } else if (data.message == "invalid password") {
        //           errorToast("Invalid password");
        //         } else {
        //           errorToast("Login failed");
        //         }
        //       }
        //     });
        // } catch (error) {a
        //   console.log(error);
        // }
        try {
          await login(values.email, values.password);
        } catch (error) {
          console.log(error);
        }
      },
    }
  );
  return (
    <WelcomePage title="Welcome To" secondTitle="DonateHub">
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
        <div className="w-full mt-5 font-normal flex flex-row-reverse">
          <Link href={"/login/forgot-password"}>Forgot Password?</Link>
        </div>
        <div className="flex flex-col border-2 mt-5 bg-primary shadow-sm rounded-lg px-2 py-2">
          <button
            type="submit"
            className="outline-none text-white font-inter font-medium"
          >
            Sign In
          </button>
        </div>

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
            onClick={() => {
              signIn("github");
            }}
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
            <span className="text-primary pl-1 underline-offset-2 underline">
              <Link href={"/signup"}>SignUp</Link>
            </span>
          </p>
        </div>
      </form>
    </WelcomePage>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default LogIn;
