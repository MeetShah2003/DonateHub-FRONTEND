import Spinner from "@/components/Spinner";
import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { BACKEND_BASE_URL, MAX_LENGTH } from "@/consts";
import { useAuth } from "@/context/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useFormik } from "formik";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const AddDisaster = () => {
  const { user } = useAuth();
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const { emailLength, inputLength } = MAX_LENGTH;

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Title is required"),
    description: Yup.string()
      .trim()
      .required("Description is required")
      .min(150, "Description must be at least 150 characters")
      .max(500, "Description must be at most 500 characters"),
    targetFund: Yup.number()
      .required("Target fund is required")
      .min(0, "Target fund must be a positive number or zero"),
    altContact: Yup.string().trim().required("Alternate contact is required"),
  });

  const initialValue: {
    tId: string;
    targetFund: number;
    title: string;
    description: string;
    altContact: number;
    disasterImage: string;
  } = {
    tId: user?._id,
    altContact: null || 0,
    description: "",
    targetFund: null || 0,
    title: "",
    disasterImage: "",
  };
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    setFieldValue,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: initialValue,
    onSubmit: (data) => {
      setLoading(true);
      fetch(`${BACKEND_BASE_URL}/trust/fundRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            successToast("Disaster Added Successfully");
            setTimeout(() => {
              push("/trust");
            }, 3000);
          }
        })
        .catch((err) => {
          errorToast("Something Went Wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    validationSchema,
  });

  const handleOnChange = async (e: any) => {
    setLoading(true);
    if (e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      try {
        const imageUrl = await uploadToCloudinary(uploadedImage, "disaster-image", access_token);

        if (imageUrl) {
          successToast("Image Upload Successfully");
          setFieldValue("disasterImage", imageUrl);
        }
      } catch (error) {
        errorToast("Image Upload Failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <TrustNavbar title="Add Disaster">
      {loading && <Spinner />}
      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="pb-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Upload Image
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="h-44 w-44 overflow-hidden rounded-[20px] border border-primary bg-white p-2">
                <Image
                  className="h-full w-full rounded-[16px] object-cover object-center"
                  src={values?.disasterImage}
                  alt="trustlogo"
                  width={500}
                  height={500}
                />
              </div>
              <label
                htmlFor="documents"
                className="cursor-pointer"
              >
                <span className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  Upload Image
                </span>
                <input
                  type="file"
                  id="documents"
                  name="documents"
                  className="hidden"
                  multiple
                  accept="*/*"
                  onChange={handleOnChange}
                />
              </label>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="pb-2 text-sm font-semibold text-slate-900">Title</p>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-primary"
              name="title"
              id="title"
              placeholder="Enter Title"
              onChange={handleChange}
              maxLength={inputLength}
              onBlur={handleBlur}
              value={values.title}
            />
            {touched.title && errors.title && (
              <div className="mt-2 text-sm text-red-500">{errors.title}</div>
            )}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="pb-2 text-sm font-semibold text-slate-900">Description</p>
            <textarea
              className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-primary"
              name="description"
              id="description"
              placeholder="why need funds?"
              onChange={handleChange}
              onBlur={handleBlur}
              minLength={150}
              maxLength={500}
              value={values.description}
            />
            {touched.description && errors.description && (
              <div className="mt-2 text-sm text-red-500">{errors.description}</div>
            )}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="pb-2 text-sm font-semibold text-slate-900">Target Funds</p>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-primary"
              name="targetFund"
              id="targetFund"
              placeholder="₹5000"
              onChange={(e) => {
                const regex = /^[0-9]*$/;
                if (!regex.test(e.target.value)) {
                  e.target.value = "";
                } else {
                  handleChange(e);
                }
              }}
              onBlur={handleBlur}
              maxLength={7}
              value={values.targetFund || ""}
            />
            {touched.targetFund && errors.targetFund && (
              <div className="mt-2 text-sm text-red-500">{errors.targetFund}</div>
            )}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="pb-2 text-sm font-semibold text-slate-900">Contact No</p>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-primary"
              name="altContact"
              id="altContact"
              placeholder="+91 9858988854"
              onChange={(e) => {
                const regex = /^[0-9]*$/;
                if (!regex.test(e.target.value)) {
                  e.target.value = "";
                } else {
                  handleChange(e);
                }
              }}
              onBlur={handleBlur}
              maxLength={10}
              value={values.altContact}
            />
            {touched.altContact && errors.altContact && (
              <div className="mt-2 text-sm text-red-500">{errors.altContact}</div>
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
    </TrustNavbar>
  );
};

export default TrustRoute(AddDisaster);
