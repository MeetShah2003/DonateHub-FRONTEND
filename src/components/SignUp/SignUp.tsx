import { useFormik } from "formik";
import Cookies from "js-cookie";
import WelcomePage from "../WelcomePage";
import GoogleIcon from "@/icons/GoogleIcon";
import GithubIcon from "@/icons/GithubIcon";
import * as Yup from "yup";

const SignUp = () => {
  const token = Cookies.get("access_token");
  console.log(token);

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
  });

  const initialValue: {
    username: string;
    email: string;
    password: string;
    role: string;
  } = {
    username: "",
    password: "",
    email: "",
    role: "user",
  };

  const { handleSubmit, handleChange, handleBlur, touched, errors, values } =
    useFormik({
      initialValues: initialValue,
      validationSchema: SignupSchema,
      onSubmit: async (values) => {
        // await fetch("http://localhost:8090/signup", {
        //   method: "POST",
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(values),
        // })
        //   .then((res) => res.json())
        //   .then((data) => {
        //     // Cookies.set("access_token", data.token);
        //     Cookies.set("access_token", data.token, { expires: 7, path: "/" });

        //   });
        console.log(values);
      },
    });
  return (
    <WelcomePage>
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
          <input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            className="outline-none tracking-wider"
            placeholder="*************"
          />
          {touched.password && errors.password && (
            <span className="text-sm text-red-600">{errors.password}</span>
          )}
        </div>
        <div className="flex flex-col border-t-transparent border-2 px-2 py-1 rounded-b-lg focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Role</label>
          <select
            className="outline-none tracking-wider"
            id="role"
            name="role"
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="user">User</option>
            <option value="trust">Trust</option>
          </select>
        </div>
        <div className="flex flex-col border-2 mt-5 bg-primary shadow-sm rounded-lg px-2 py-2">
          <button
            type="submit"
            className="outline-none text-white font-inter font-medium"
          >
            Sign Up
          </button>
        </div>
        <div className="flex flex-col border-2 mt-4 shadow-sm rounded-lg px-2 py-2">
          <button
            type="button"
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
              <GithubIcon />
            </span>
            Continue with GitHub
          </button>
        </div>
      </form>
    </WelcomePage>
  );
};

export default SignUp;
