import Spinner from "@/components/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { ContactUsType } from "@/types/types";
import { BACKEND_BASE_URL, MAX_LENGTH } from "@/consts";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import * as Yup from "yup";

const TrustContactUs = () => {
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const { emailLength, inputLength } = MAX_LENGTH;
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

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    contactNo: Yup.string().trim().required("Mobile No is required"),
    subject: Yup.string().trim().required("Subject is required"),
    message: Yup.string().trim().required("Message is required"),
  });

  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: initialValues,
      onSubmit: (values) => {
        setLoading(true);
        if (values) {
          fetch(`${BACKEND_BASE_URL}/trust/contactUs`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(values),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data) {
                successToast("Form Submitted Successfully");
                setTimeout(() => {
                  push("/dashboard");
                }, 3000);
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
      validationSchema,
    });

  return (
    <div>
      {loading && <Spinner />}

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
            <label className="pb-1 text-sm font-medium text-slate-700">Your Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={values.name}
              maxLength={inputLength}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full bg-transparent text-sm text-slate-900 outline-none tracking-wider"
              placeholder="John Doe"
            />
            {touched.name && errors.name && (
              <span className="text-sm text-red-600">{errors.name}</span>
            )}
          </div>
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
            <label className="pb-1 text-sm font-medium text-slate-700">Your Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              maxLength={emailLength}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full bg-transparent text-sm text-slate-900 outline-none tracking-wider"
              placeholder="johndoe@gmail.com"
            />
            {touched.email && errors.email && (
              <span className="text-sm text-red-600">{errors.email}</span>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
            <label className="pb-1 text-sm font-medium text-slate-700">Mobile No</label>
            <input
              id="contactNo"
              name="contactNo"
              type="number"
              value={values.contactNo as number}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={10}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value
                  .replace(/\D/, "")
                  .slice(0, 10);
                handleChange(e);
              }}
              className="w-full bg-transparent text-sm text-slate-900 outline-none tracking-wider"
              placeholder="+91 9878588845"
            />
            {touched.contactNo && errors.contactNo && (
              <span className="text-sm text-red-600">{errors.contactNo}</span>
            )}
          </div>

          <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
            <label className="pb-1 text-sm font-medium text-slate-700">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              maxLength={inputLength}
              value={values.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full bg-transparent text-sm text-slate-900 outline-none tracking-wider"
              placeholder="For Donation Support"
            />
            {touched.subject && errors.subject && (
              <span className="text-sm text-red-600">{errors.subject}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary">
          <label className="pb-1 text-sm font-medium text-slate-700">Message</label>
          <textarea
            id="message"
            name="message"
            className="min-h-[140px] w-full resize-none bg-transparent text-sm text-slate-900 outline-none tracking-wider"
            rows={4}
            cols={30}
            maxLength={500}
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
            className="w-full rounded-2xl bg-primary p-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrustContactUs;
