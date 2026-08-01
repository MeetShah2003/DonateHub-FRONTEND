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
import { useAuth } from "@/context/auth";
import { BACKEND_BASE_URL, MAX_LENGTH } from "@/consts";
import Spinner from "../Spinner";
import { auth, authProvider } from "../../firebase";
import {
  UserCredential,
  getAdditionalUserInfo,
  signInWithPopup,
} from "firebase/auth";
import TrustNotLoginPopup from "../TrustNotLoginPopup.tsx";

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
    .trim()
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .trim()
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
});

const LogIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { inputLength, emailLength } = MAX_LENGTH;
  const [reason, setReason] = useState<"blocked" | "pending">();

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  useEffect(() => {
    if (isAuthenticated && user && !user.isBlocked) {
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
  }, [isAuthenticated, user, router]);
  const { handleChange, handleSubmit, handleBlur, errors, touched } = useFormik(
    {
      initialValues: initialValue,
      validationSchema: loginSchema,
      onSubmit: async (values) => {
        setLoading(true);
        fetch(`${BACKEND_BASE_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data && data?.token) {
              console.log("data>>", data);
              Cookies.set("role", data?.user?.role);
              if (data?.user?.role === "admin") {
                Cookies.set("access_token", data?.token);
                successToast(
                  `Welcome ${data.user.firstName} ${data.user.lastName}`
                );
                setTimeout(() => {
                  router.push("/admin");
                }, 3000);
              }
              if (data?.user?.role === "user") {
                if (!data?.user.isBlocked) {
                  Cookies.set("access_token", data?.token);
                  successToast(
                    `Welcome ${data.user.firstName} ${data.user.lastName}`
                  );
                  setTimeout(() => {
                    router.push("/dashboard");
                  }, 3000);
                } else {
                  errorToast("You Are Blocked");
                }
              }
              if (data?.trust?.role === "trust") {
                Cookies.set("role", data?.trust?.role);
                if (data && data.trust.isVerified && !data.trust.isBlocked) {
                  Cookies.set("access_token", data?.token);
                  successToast(`Welcome ${data.trust.trustName}`);
                  setTimeout(() => {
                    router.push("/trust");
                  }, 3000);
                } else {
                  if (!data.trust.isVerified) {
                    setReason("pending");
                    setIsOpen(true);
                  } else {
                    setReason("blocked");
                    setIsOpen(true);
                  }
                }
              }
            } else {
              console.log(data.message);
              if (data.message === "invalid password") {
                errorToast("Incorrect Password");
              } else {
                errorToast("email not found");
              }
            }
          })
          .catch((error) => {
            errorToast(error.message);
          })
          .finally(() => {
            setLoading(false);
          });
      },
    }
  );

  const handleGoogleLogin = async () => {
    try {
      const data: UserCredential = await signInWithPopup(auth, authProvider);

      const additionalUserInfo = getAdditionalUserInfo(data);

      if (additionalUserInfo && additionalUserInfo.profile) {
        const { given_name, family_name, email } = additionalUserInfo.profile;

        googleUserData({
          firstName: given_name,
          lastName: family_name,
          email,
        });
      } else {
        console.error("Additional user info not available");
      }
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  const googleUserData = (data: any) => {
    fetch(`${BACKEND_BASE_URL}/api/googleSignup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data: any) => {
        Cookies.set("data", data);
        Cookies.set("access_token", data?.token);
        Cookies.set("role", data?.user?.role);
        if (data?.user?.role === "admin") {
          successToast(`welcome ${data.user.firstName} ${data.user.lastName}`);
          setTimeout(() => {
            router.push("/admin");
          }, 3000);
        } else {
          successToast(
            `welcome back ${data.user.firstName} ${data.user.lastName}`
          );
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        }
      });
  };

  const handleGithubLogin = async () => {
    try {
      const data: UserCredential = await signInWithPopup(auth, authProvider);

      const additionalUserInfo = getAdditionalUserInfo(data);

      if (additionalUserInfo && additionalUserInfo.profile) {
        const { email } = additionalUserInfo.profile;

        githubUserData({
          email,
        });
      } else {
        console.error("Additional user info not available");
      }
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  const githubUserData = (data: any) => {
    fetch(`${BACKEND_BASE_URL}/api/githubSignup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        Cookies.set("access_token", data?.token);
        Cookies.set("role", data?.user?.role);
        if (data?.user?.role === "admin") {
          successToast(`welcome back ${data.user.email}`);
          setTimeout(() => {
            router.push("/admin");
          }, 3000);
        } else {
          successToast(`welcome back ${data.user.email}`);
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        }
      });
  };
  return (
    <div className="flex h-screen justify-center overflow-hidden bg-slate-50">
      <WelcomePage title="Welcome To" secondTitle="DonateHub">
        {loading && <Spinner />}
        <TrustNotLoginPopup
          reason={reason}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <form
          className="mx-5 w-full max-w-xl rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.35)] lg:mx-10 lg:p-8"
          onSubmit={handleSubmit}
        >
          <h3 className="mb-8 text-3xl font-bold tracking-wider text-slate-900 font-inter">
            Sign in
          </h3>
          <div className="flex flex-col rounded-t-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
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
              <span className="text-sm text-red-600">{errors.email}</span>
            )}
          </div>
          <div className="mt-3 flex flex-col rounded-b-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
            <label className="pb-1 text-sm font-medium text-slate-700">Password</label>
            <div className="flex items-center justify-between gap-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                maxLength={15}
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
              <span className="text-sm text-red-600">{errors.password}</span>
            )}
          </div>
          <div className="mt-5 flex w-full flex-row-reverse text-sm font-medium text-slate-600">
            <Link href={"/login/forgot-password"}>Forgot Password?</Link>
          </div>
          <div className="mt-5 flex flex-col rounded-2xl bg-primary px-2 py-3 shadow-sm">
            <button
              type="submit"
              className="text-sm font-semibold text-white outline-none"
            >
              Sign In
            </button>
          </div>

          <div className="mt-4 flex flex-col rounded-2xl border border-slate-200 bg-white px-2 py-3 shadow-sm">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-800 outline-none"
            >
              <span>
                <GoogleIcon />
              </span>
              Continue with Google
            </button>
          </div>

          <div className="mt-4 flex flex-col rounded-2xl border border-slate-200 bg-white px-2 py-3 shadow-sm">
            <button
              type="button"
              onClick={handleGithubLogin}
              className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-800 outline-none"
            >
              <span>
                <GithubIcon />
              </span>
              Continue with GitHub
            </button>
          </div>
          <div className="my-3 flex justify-center text-sm text-slate-600">
            <p>
              Not a registered user yet?
              <span className="pl-1 text-primary underline-offset-2 underline">
                <Link href={"/signup"}>SignUp</Link>
              </span>
            </p>
          </div>
        </form>
      </WelcomePage>
    </div>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default LogIn;
