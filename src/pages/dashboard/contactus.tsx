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
    <div>
      <div className="sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      {loading && <Spinner />}
      <h1 className="font-inter py-5 font-semibold text-steelGray text-xl sm:text-2xl max-w-screen-md mx-auto flex flex-col gap-2 w-full">
        Contact Us
      </h1>
      <ContactUs />
    </div>
  );
};

export default UserRoute(ContactUsPage);
