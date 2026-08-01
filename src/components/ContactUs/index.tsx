import Spinner from "@/components/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { ContactUsType } from "@/types/types";
import { BACKEND_BASE_URL, MAX_LENGTH } from "@/consts";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import * as Yup from "yup";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const { emailLength, inputLength } = MAX_LENGTH;
  const access_token = Cookies.get("access_token");

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
      validationSchema,
      onSubmit: (values) => {
        if (values) {
          setLoading(true);
          fetch(`${BACKEND_BASE_URL}/api/contactUs`, {
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
                }, 1500);
              }
            })
            .catch(() => {
              errorToast("Something went wrong. Please try again.");
            })
            .finally(() => {
              setLoading(false);
            });
        }
      },
    });

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[400px_1fr]">
      <div className="rounded-[32px] border border-slate-200 bg-slate-800 p-8 text-white shadow-[0_25px_70px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Need help?</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">Get in touch with our support team</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Share your question, feedback, or issue and we will respond as soon as possible. Our support team is available for users and donations assistance.
        </p>

        <div className="mt-8 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
            <p className="mt-3 text-sm font-semibold text-white">support@donatehub.com</p>
            <p className="mt-1 text-sm text-slate-300">General enquiries and support</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</p>
            <p className="mt-3 text-sm font-semibold text-white">+91 98765 43210</p>
            <p className="mt-1 text-sm text-slate-300">Available Mon–Fri, 9am–6pm</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Response time</p>
            <p className="mt-3 text-sm font-semibold text-white">Usually within 24 hours</p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Contact form</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Send us a message</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Fill in the details below and we’ll get back to you shortly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="group">
              <span className="mb-2 block text-sm font-medium text-slate-700">Your Full Name</span>
              <input
                id="name"
                name="name"
                type="text"
                value={values.name}
                maxLength={inputLength}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="John Doe"
              />
              {touched.name && errors.name && (
                <span className="mt-2 block text-sm text-red-600">{errors.name}</span>
              )}
            </label>

            <label className="group">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email Address</span>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                maxLength={emailLength}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="johndoe@gmail.com"
              />
              {touched.email && errors.email && (
                <span className="mt-2 block text-sm text-red-600">{errors.email}</span>
              )}
            </label>
          </div>

          <label className="group">
            <span className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</span>
            <input
              id="contactNo"
              name="contactNo"
              type="tel"
              inputMode="tel"
              maxLength={10}
              value={values.contactNo as number}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="+91 98765 43210"
            />
            {touched.contactNo && errors.contactNo && (
              <span className="mt-2 block text-sm text-red-600">{errors.contactNo}</span>
            )}
          </label>

          <label className="group">
            <span className="mb-2 block text-sm font-medium text-slate-700">Subject</span>
            <input
              id="subject"
              name="subject"
              type="text"
              maxLength={inputLength}
              value={values.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="For Donation Support"
            />
            {touched.subject && errors.subject && (
              <span className="mt-2 block text-sm text-red-600">{errors.subject}</span>
            )}
          </label>

          <label className="group">
            <span className="mb-2 block text-sm font-medium text-slate-700">Message</span>
            <textarea
              id="message"
              name="message"
              className="h-40 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              maxLength={500}
              placeholder="Describe your question or feedback"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.message}
            />
            {touched.message && errors.message && (
              <span className="mt-2 block text-sm text-red-600">{errors.message}</span>
            )}
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
