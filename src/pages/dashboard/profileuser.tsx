import { useFormik } from "formik";
import CameraIcon from "@/icons/CameraIcon";
import Image from "next/image";
import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import * as Yup from "yup";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/context/auth";
import { BACKEND_BASE_URL, MAX_LENGTH } from "@/consts";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { uploadToCloudinary } from "@/lib/cloudinary";
import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";

const ProfileUser = () => {
  const { user } = useAuth();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const { emailLength, inputLength } = MAX_LENGTH;
  const [image, setImage] = useState<File | null>(null);
  const [imageKey, setImageKey] = useState<number>(0);

  const access_token = Cookies.get("access_token");

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const getUpdateAdminProfile = (data: any) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/api/updMyProfile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          successToast("Profile Update Successfully");
          window.location.reload();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const profileSchema = Yup.object().shape({
    firstName: Yup.string().trim().required("FirstName is required"),
    lastName: Yup.string().trim().required("LastName is required"),
    gender: Yup.string().trim().required("Please select a gender"),
    email: Yup.string().trim().email("Invalid email"),
    mono: Yup.string()
      .trim()
      .matches(
        /^[+]?[0-9]+$/,
        "Mobile number must contain only digits and can optionally start with a '+'"
      )
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number can't exceed 15 digits")
      .required("Mobile Number is required"),
  });

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
    values,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      userlogo: user?.userlogo,
      email: user?.email || "",
      gender: user?.gender || "",
      mono: user?.mono || "",
    },
    validationSchema: profileSchema,
    onSubmit: async (formValues) => {
      getUpdateAdminProfile(formValues);
    },
  });

  // const handleOnChange = async (e: any) => {
  //   if (e.target.files[0]) {
  //     const uploadedImage = e.target.files[0];
  //     const imageRef = ref(storage, `user_profile_image/${v4()}`);

  //     try {
  //       await uploadBytes(imageRef, uploadedImage);
  //       const imageUrl = await getDownloadURL(imageRef);

  //       if (imageUrl) {
  //         successToast("Image Upload Successfully");
  //         setFieldValue("userlogo", imageUrl);
  //       }
  //     } catch (error) {
  //       errorToast("Image Upload Failed");
  //     }
  //   }
  // };

  const handleOnChange = async (e: any) => {
    if (e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      setImage(uploadedImage);

      try {
        const imageUrl = await uploadToCloudinary(uploadedImage, "user-profile", access_token);

        if (imageUrl) {
          successToast("Image Upload Successfully");

          setValues((prevValues) => ({
            ...prevValues,
            userlogo: imageUrl,
          }));
          setImageKey(new Date().getTime());
        }
      } catch (error) {
        errorToast("Image Upload Failed");
      }
    }
  };

  return (
    <div>
      <div className="navbar sticky top-0 z-10 bg-white">
        <Visitor />
      </div>
      {loading && <Spinner />}
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Your Account</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            View and update your profile details. Keep your contact information and account settings current.
          </p>
        </div>

        <form className="grid gap-8 lg:grid-cols-[320px_1fr]" onSubmit={handleSubmit}>
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="relative mx-auto mb-8 h-36 w-36 overflow-hidden rounded-full border-4 border-primary bg-slate-100">
              <Image
                key={imageKey}
                className="h-full w-full object-cover"
                src={values.userlogo || user?.userlogo}
                alt="user profile"
                width={144}
                height={144}
              />
              <input
                type="file"
                id="userlogo"
                name="userlogo"
                accept="image/*"
                className="hidden"
                onChange={handleOnChange}
              />
              <label
                htmlFor="userlogo"
                className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full border border-white bg-primary text-white shadow-lg transition hover:bg-primary/90"
              >
                <CameraIcon />
              </label>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-slate-900">
                {values.firstName || "User"} {values.lastName || "Profile"}
              </p>
              <p className="mt-2 text-sm text-slate-500">Member</p>
            </div>
            <div className="mt-8 space-y-4 text-sm text-slate-600">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
                <p className="mt-3 text-sm text-slate-900">{values.email || user?.email}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</p>
                <p className="mt-3 text-sm text-slate-900">{values.mono || user?.mono || "Not added"}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Gender</p>
                <p className="mt-3 text-sm text-slate-900">{values.gender || user?.gender || "Not specified"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Account details</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Edit your profile</h2>
              <p className="mt-2 text-sm text-slate-500">
                Make changes to your personal info and keep it refreshed for a better experience.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="John"
                  maxLength={inputLength}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName}
                />
                {touched.firstName && errors.firstName && (
                  <span className="text-sm text-red-600">{errors.firstName.toString()}</span>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Doe"
                  maxLength={inputLength}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                />
                {touched.lastName && errors.lastName && (
                  <span className="text-sm text-red-600">{errors.lastName.toString()}</span>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex cursor-pointer items-center justify-center rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                    values.gender === "male" || user?.gender === "male"
                      ? "border-primary bg-primary/10 text-slate-900"
                      : "border-slate-300 bg-white text-slate-600"
                  }`}>
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={values.gender === "male" || user?.gender === "male"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="sr-only"
                    />
                    Male
                  </label>
                  <label className={`flex cursor-pointer items-center justify-center rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                    values.gender === "female" || user?.gender === "female"
                      ? "border-primary bg-primary/10 text-slate-900"
                      : "border-slate-300 bg-white text-slate-600"
                  }`}>
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={values.gender === "female" || user?.gender === "female"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="sr-only"
                    />
                    Female
                  </label>
                </div>
                {touched.gender && errors.gender && (
                  <span className="text-sm text-red-600">{errors.gender.toString()}</span>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    disabled={isDisabled}
                    value={values.email}
                    onChange={handleChange}
                    maxLength={emailLength}
                    onBlur={handleBlur}
                    className="w-full rounded-3xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                    placeholder="johndoe@gmail.com"
                  />
                  {touched.email && errors.email && (
                    <span className="text-sm text-red-600">{errors.email.toString()}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Mobile No</label>
                  <input
                    id="mono"
                    name="mono"
                    type="number"
                    value={values.mono}
                    onChange={handleChange}
                    maxLength={10}
                    onBlur={handleBlur}
                    className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="+91 9878588845"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value
                        .replace(/\D/, "")
                        .slice(0, 10);
                      handleChange(e);
                    }}
                  />
                  {touched.mono && errors.mono && (
                    <span className="text-sm text-red-600">{errors.mono.toString()}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default UserRoute(ProfileUser);
