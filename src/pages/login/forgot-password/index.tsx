import Link from "next/link";
import WelcomePage from "../../../components/WelcomePage";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const router = useRouter();
  const { handleChange, handleSubmit, handleBlur, touched, errors, values } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: forgotPasswordSchema,
      onSubmit: () => {
        router.push("/login/forgot-password/enterotp");
        console.log(values);
      },
    });

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
          <p className="text-steelGray">
            <Link href={"/login"}>I'll remember the password</Link>
          </p>
        </div>
      </form>
    </WelcomePage>
  );
};

export default ForgotPassword;
