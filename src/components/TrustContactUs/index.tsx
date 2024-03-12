import Spinner from "@/components/Spinner";
import Visitor from "@/components/Visitor";
import { useFormik } from "formik";
import { useState } from "react";
import { ContactUsType } from "@/types/types";
import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const TrustContactUs = () => {
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const { push } = useRouter();

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const initialValues: ContactUsType = {
    contactNo: null,
    email: "",
    message: "",
    name: "",
    subject: "",
  };

  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: initialValues,
      onSubmit: (values) => {
        setLoading(true);
        if (values) {
          console.log(values);
          fetch(`${BACKEND_BASE_URL}/trust/contactUs`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(values),
          })
            .then((res) => {
              if (res && res.status === 200) {
                return res.json();
              }
            })
            .then((data) => {
              if (data) {
                successToast("Form Submitted Successfully");
                push("/dashboard");
              }
            })
            .catch(() => {
              errorToast("Something Went Wrong");
            })
            .finally(() => {
              setLoading(false);
            });
        }
      },
    });

  return (
    <div>
      {loading && <Spinner />}

      <form
        onSubmit={handleSubmit}
        className="max-w-full mx-auto flex flex-col gap-2 w-full"
      >
        <div className="flex flex-col border-2 px-2 py-1 focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Your Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className="outline-none tracking-wider"
            placeholder="John Doe"
          />
          {touched.name && errors.name && (
            <span className="text-sm text-red-600">{errors.name}</span>
          )}
        </div>
        <div className="flex flex-col border-2 px-2 py-1 focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Your Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="outline-none tracking-wider"
            placeholder="johndoe@gmail.com"
          />
          {touched.email && errors.email && (
            <span className="text-sm text-red-600">{errors.email}</span>
          )}
        </div>

        <div className="flex flex-col border-2 px-2 py-1 focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Mobile No</label>
          <input
            id="contactNo"
            name="contactNo"
            type="number"
            value={values.contactNo}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault(); // Prevent the default behavior of increasing/decreasing the value
              }
            }}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value.length > 10) {
                e.target.value = e.target.value.slice(0, 10);
              }
            }}
            className="outline-none tracking-wider"
            placeholder="+91 9878588845"
          />
          {touched.contactNo && errors.contactNo && (
            <span className="text-sm text-red-600">{errors.contactNo}</span>
          )}
        </div>

        <div className="flex flex-col border-2 px-2 py-1 focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Subject</label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className="outline-none tracking-wider"
            placeholder="For Donation Support"
          />
          {touched.subject && errors.subject && (
            <span className="text-sm text-red-600">{errors.subject}</span>
          )}
        </div>

        <div className="flex flex-col border-2 px-2 py-1 focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Message</label>
          <textarea
            id="message"
            name="message"
            className="outline-none tracking-wider resize-none"
            rows={4}
            cols={30}
            placeholder="Enter Message Here"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.message}
          />
          {touched.message && errors.message && (
            <span className="text-sm text-red-600">{errors.message}</span>
          )}
        </div>

        <div className="w-full">
          <button
            type="submit"
            className="bg-primary w-full font-bold text-white p-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrustContactUs;
