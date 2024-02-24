import WelcomePage from "@/components/WelcomePage";
import HidePasswordIcon from "@/icons/HidePasswordIcon";
import ShowPasswordIcon from "@/icons/ShowPasswordIcon";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { BACKEND_BASE_URL } from "@/consts";
import { useAuth } from "@/context/auth";
import Spinner from "@/components/Spinner";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must match"
  ),
});

const Password = () => {
  const successToast = (message: string) => toast.success(message);
  const errorToast = (message: string) => toast.error(message);
  const router = useRouter();
  // const { forgotPasswordEmail } = useAuth();
  const forgotPasswordEmail = Cookies.get("forgotPasswordEmail");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, handleChange, handleBlur, errors, touched } = useFormik(
    {
      initialValues: { password: "", confirmPassword: "" },
      validationSchema: validationSchema,
      onSubmit: (formData) => {
        setLoading(true);
        const { confirmPassword, ...passwordData } = formData;
        const newData: { forgotPasswordEmail: string; newPassword: string } = {
          forgotPasswordEmail: forgotPasswordEmail as string,
          newPassword: passwordData.password,
        };
        fetch(`${BACKEND_BASE_URL}/api/updatePassword`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        })
          .then((res) => {
            if (res && res.status === 200) {
              return res.json();
            }
          })
          .then((data) => {
            Cookies.remove("forgotPasswordEmail");
            console.log("forgotdata", data.updatedPassword);
            if (data.updatedPassword) {
              successToast("Password Change Successfully");
            } else {
              errorToast("Something went wrong");
            }
          })
          .finally(() => {
            setLoading(false);
          });
        router.push("/login/forgot-password/change-success");
        console.log(passwordData);
      },
    }
  );
  return (
    <WelcomePage title="Reset" secondTitle="Password">
      {loading && <Spinner />}
      <form className="mx-5 lg:mx-20 py-10 gap-20" onSubmit={handleSubmit}>
        <h3 className="font-inter text-3xl drop-shadow-2xl tracking-wider font-bold mb-8">
          Enter New Password
        </h3>
        <div className="flex flex-col  border-2 rounded-t-lg px-2 py-1 focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">New Password</label>
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
        <div className="flex mt-5 flex-col border-2  bg-primary shadow-sm rounded-lg px-2 py-2">
          <button
            type="submit"
            className="outline-none text-white font-inter font-medium"
          >
            Confirm
          </button>
        </div>
      </form>
    </WelcomePage>
  );
};

export default Password;
