import { useFormik } from "formik";
import Link from "next/link";
import Cookies from "js-cookie";

const initialValue: {
  email: string;
  password: string;
} = {
  password: "",
  email: "",
};

const LogIn = () => {
  const token = Cookies.get("access_token");
  const { initialValues, handleChange, handleSubmit } = useFormik({
    initialValues: initialValue,
    onSubmit: async (values) => {
      await fetch("http://localhost:8090/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          // Cookies.set("access_token", data.token);
          Cookies.set("access_token", data.token, { expires: 7, path: "/" });
        });
    },
  });
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="email"
          onChange={handleChange}
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button className="bg-black p-10" type="submit">
          LogIn
        </button>
        <Link target="_blank" href={"http://localhost:8090/auth/google"}>
          Google
        </Link>
      </form>
    </div>
  );
};

export default LogIn;
