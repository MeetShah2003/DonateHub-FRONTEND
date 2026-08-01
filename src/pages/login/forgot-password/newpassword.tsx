import WelcomePage from "@/components/WelcomePage";
import HidePasswordIcon from "@/icons/HidePasswordIcon";
import ShowPasswordIcon from "@/icons/ShowPasswordIcon";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { BACKEND_BASE_URL, MAX_LENGTH } from "@/consts";
import Spinner from "@/components/Spinner";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Required")
    .min(8, "Password must be at least 8 characters")
    .matches(/^[A-Z]/, "First character must be a capital letter")
    .trim(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .trim(),
});

const Password = () => {
  const successToast = (message: string) => toast.success(message);
  const errorToast = (message: string) => toast.error(message);
  const router = useRouter();
  const forgotPasswordEmail = Cookies.get("forgotPasswordEmail");
  const [loading, setLoading] = useState(false);
  const { inputLength } = MAX_LENGTH;
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, handleChange, handleBlur, errors, touched } = useFormik(
    {
      initialValues: { password: "", confirmPassword: "" },
      validationSchema: validationSchema,
      onSubmit: (formData) => {
        setLoading(true);
        const { confirmPassword, ...passwordData } = formData;
        const newData: { email: string; password: string } = {
          email: forgotPasswordEmail as string,
          password: passwordData.password,
        };
        fetch(`${BACKEND_BASE_URL}/api/updatePassword`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.updatedPassword) {
              Cookies.remove("forgotPasswordEmail");
              successToast("Password Change Successfully");
            } else {
              errorToast("Something went wrong");
            }
          })
          .finally(() => {
            setLoading(false);
          });
        setTimeout(() => {
          router.push("/login/forgot-password/change-success");
        }, 3000);
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
            Secure Access
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            Enter New Password
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Choose a new password for your account.
          </p>
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
          <label className="pb-1 text-sm font-medium text-slate-700">New Password</label>
          <div className="flex items-center justify-between gap-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={15}
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
          <label className="pb-1 text-sm font-medium text-slate-700">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={15}
            className="w-full bg-transparent text-sm text-slate-900 outline-none tracking-wider"
            placeholder="••••••••"
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <span className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-col rounded-2xl bg-primary px-2 py-3 shadow-sm">
          <button
            type="submit"
            className="text-sm font-semibold text-white"
          >
            Confirm
          </button>
        </div>
      </form>
    </WelcomePage>
  );
};

export default Password;
