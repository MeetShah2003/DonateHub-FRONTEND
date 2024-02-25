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
import { useSession, signIn } from "next-auth/react";
import { useAuth } from "@/context/auth";
import { BACKEND_BASE_URL } from "@/consts";
import Spinner from "../Spinner";
import { auth, authProvider } from "../../firebase";
import {
  UserCredential,
  getAdditionalUserInfo,
  signInWithPopup,
} from "firebase/auth";
import BlockedTrustIcon from "@/icons/BlockedTrustIcon";
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
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<"blocked" | "pending">();

  const { data: session } = useSession();

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

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
          .then((res) => {
            if (res && res.ok) {
              return res.json();
            }
          })
          .then((data) => {
            if (data && data?.token) {
              // Cookies.set("access_token", data?.token);
              Cookies.set("role", data?.user?.role);
              if (data?.user?.role === "admin") {
                Cookies.set("access_token", data?.token);

                successToast(
                  `Welcome ${data.user.firstName} ${data.user.lastName}`
                );
                setTimeout(() => {
                  router.push("/admin");
                }, 3000);
              } else if (data?.user?.role === "user") {
                Cookies.set("access_token", data?.token);
                successToast(
                  `Welcome ${data.user.firstName} ${data.user.lastName}`
                );
                setTimeout(() => {
                  router.push("/dashboard");
                }, 3000);
              } else {
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
                  } else if (data.trust.isBlocked) {
                    setReason("blocked");
                    setIsOpen(true);
                  }
                }
              }
            }
          })
          .catch((error) => {
            console.log(error);
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
      console.log(error);
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
      console.log(error);
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
    <div className="flex justify-center h-full">
      <WelcomePage title="Welcome To" secondTitle="DonateHub">
        {loading && <Spinner />}
        <TrustNotLoginPopup
          reason="pending"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        ;
        <form className="mx-5 lg:mx-20 gap-20 pb-8" onSubmit={handleSubmit}>
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
              onClick={handleGoogleLogin}
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
              onClick={handleGithubLogin}
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
    </div>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default LogIn;
