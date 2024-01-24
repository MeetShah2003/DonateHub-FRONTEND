import Link from "next/link";
import WelcomePage from "../../../components/WelcomePage";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { toast } from "react-toastify";
// import { useUser } from "@/context/user";
import { useEffect } from "react";

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
  // const { forgotPasswordEmail, setForgotPasswordEmail } = useUser();
  const { handleChange, handleSubmit, handleBlur, touched, errors } = useFormik(
    {
      initialValues: {
        email: "",
      },
      validationSchema: forgotPasswordSchema,
      onSubmit: (values) => {
        try {
          fetch(`http://localhost:8090/api/userEmail`, {
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
                setTimeout(() => {
                  router.push("/login/forgot-password/enterotp");
                }, 3000);
              }
            });
          console.log("forgotPasswordEmail", forgotPasswordEmail);
        } catch (error) {
          console.log(error);
        }
      },
    }
  );
  // Use useEffect to log the updated value of forgotPasswordEmail
  // useEffect(() => {
  //   console.log("forgotPasswordEmail", forgotPasswordEmail);
  // }, [forgotPasswordEmail]);
  return (
    <WelcomePage title="Reset" secondTitle="Password">
      <form className="mx-5 lg:mx-20 py-10 gap-20" onSubmit={handleSubmit}>
        <h3 className="font-inter text-3xl drop-shadow-2xl tracking-wider font-bold mb-8">
          Reset Password
        </h3>
        <div className="flex flex-col border-2 px-2 py-1 rounded-lg focus-within:border-primary">
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
        <div className="flex mt-5 flex-col border-2  bg-primary shadow-sm rounded-lg px-2 py-2">
          <button
            type="submit"
            className="outline-none text-white font-inter font-medium"
          >
            Send Otp
          </button>
        </div>

        <div className="my-5 flex justify-center ">
          <p className="text-gray-400">
            <Link href={"/login"}>&lt;Back</Link>
          </p>
        </div>
      </form>
    </WelcomePage>
  );
};

export default ForgotPassword;
