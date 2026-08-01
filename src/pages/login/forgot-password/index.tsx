import Link from "next/link";
import WelcomePage from "../../../components/WelcomePage";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL, MAX_LENGTH } from "@/consts";
import { useAuth } from "@/context/auth";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import Cookies from "js-cookie";

const errorToast = (errorMessage: string) => toast.error(errorMessage);
const successToast = (successMessage: string) => toast.success(successMessage);

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setForgotPasswordEmail } = useAuth();
  const { inputLength, emailLength } = MAX_LENGTH;

  const { handleChange, handleSubmit, handleBlur, touched, errors } = useFormik(
    {
      initialValues: {
        email: "",
      },
      validationSchema: forgotPasswordSchema,
      onSubmit: (values) => {
        setLoading(true);
        fetch(`${BACKEND_BASE_URL}/api/userEmail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message === "user not found") {
              errorToast("User not found");
            } else {
              setForgotPasswordEmail(data.email);
              successToast("Otp sent sucessfully");
              Cookies.set("forgotPasswordEmail", values.email);
              setTimeout(() => {
                router.push("/login/forgot-password/enterotp");
              }, 3000);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      },
    }
  );
  return (
    <WelcomePage title="Reset" secondTitle="Password">
      {loading && <Spinner />}
      <form
        className="mx-auto w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] md:p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Security
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            Reset Password
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Enter your email and we will send the password reset code.
          </p>
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
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

        <div className="mt-5 flex flex-col rounded-2xl bg-primary px-2 py-3 shadow-sm">
          <button
            type="submit"
            className="text-sm font-semibold text-white"
          >
            Send Otp
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <p className="text-sm text-slate-500">
            <Link href={"/login"} className="hover:text-primary">
              &lt;Back
            </Link>
          </p>
        </div>
      </form>
    </WelcomePage>
  );
};

export default ForgotPassword;
