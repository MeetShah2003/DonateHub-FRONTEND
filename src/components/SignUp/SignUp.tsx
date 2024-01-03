import { useFormik } from "formik";
import Cookies from "js-cookie";

const SignUp = () => {
  const token = Cookies.get("access_token");
  console.log(token);

  const initialValue: {
    username: string;
    email: string;
    password: string;
    role: string;
  } = {
    username: "",
    password: "",
    email: "",
    role: "",
  };

  const formik = useFormik({
    initialValues: initialValue,
    onSubmit: async (values) => {
      await fetch("http://localhost:8090/signup", {
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
    <div className="max-w-full w-90% mx-auto">
      <form id="form" onSubmit={formik.handleSubmit}>
        username email password confirmpassword role(trust/user)
        <input
          id="username"
          name="username"
          placeholder="enter username"
          onChange={formik.handleChange}
        />
        <input
          id="email"
          name="email"
          placeholder="enter email"
          onChange={formik.handleChange}
        />
        <input
          id="password"
          name="password"
          placeholder="enter password"
          onChange={formik.handleChange}
        />
        <input
          id="role"
          name="role"
          placeholder="enter role"
          onChange={formik.handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignUp;
