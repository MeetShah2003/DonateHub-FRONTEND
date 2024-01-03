import { useFormik } from "formik";
import Cookies from "js-cookie";

const initialValue: {
  trustName: string;
  title: string;
  description: string;
  founder: string;
  category: string;
} = {
  trustName: "",
  title: "",
  category: "",
  description: "",
  founder: "",
};

const AddTrust = () => {
  const token = Cookies.get("access_token");

  const { handleSubmit, handleChange, initialValues } = useFormik({
    initialValues: initialValue,
    onSubmit: async (values) => {
      await fetch("http://localhost:8090/trust/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="trust name"
          id="trustName"
          name="trustName"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="title"
          id="title"
          name="title"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="description"
          id="description"
          name="description"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="founder"
          id="founder"
          name="founder"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Category"
          id="category"
          name="category"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddTrust;
