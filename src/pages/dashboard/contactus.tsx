import Spinner from "@/components/Spinner";
import Visitor from "@/components/Visitor";
import { useFormik } from "formik";
import { useState } from "react";
import { ContactUsType } from "@/types/types";
import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import UserRoute from "@/components/UserRoute/UserRoute";
import ContactUs from "@/components/ContactUs";
import TrustContactUs from "@/components/TrustContactUs";

const ContactUsPage = () => {
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
              }, 3000);
            }
          })
          .catch((error) => {
            errorToast("Something Went Wrong");
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 bg-white z-10 border-b border-slate-200">
        <Visitor />
      </div>
      {loading && <Spinner />}
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-[32px] bg-white px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Support</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Contact Us</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Have a question or need help? Send us a message and our support team will get back to you within 24 hours.
          </p>
        </section>
        <ContactUs />
      </main>
    </div>
  );
};

export default UserRoute(ContactUsPage);
