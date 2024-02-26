import { useFormik } from "formik";
import CameraIcon from "@/icons/CameraIcon";
import Image from "next/image";
import AdminFrame from "@/components/AdminFrame";
import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import * as Yup from "yup";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/context/auth";
import { BACKEND_BASE_URL } from "@/consts";
import { toast } from "react-toastify";
import AdminRoute from "@/components/AdminRoute";
import Spinner from "@/components/Spinner";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { v4 } from "uuid";

const AdminProfile = () => {
  const { user } = useAuth();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  // const getAdminProfile = () => {
  //   fetch(`${BACKEND_BASE_URL}/admin/adminProfile`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setUserData(data["myProfile"]);
  //     });
  // };

  const getUpdateAdminProfile = (data: any) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/updateProfile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          successToast("Profile Update Successfully");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const profileSchema = Yup.object().shape({
    firstName: Yup.string().required("FirstName is required"),
    lastName: Yup.string().required("LastName is required"),
    gender: Yup.string().required("Please select a gender"),
    email: Yup.string().trim().email("Invalid email"),
    mono: Yup.string()
      .matches(
        /^[+]?[0-9]+$/,
        "Mobile number must contain only digits and can optionally start with a '+'"
      )
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number can't exceed 15 digits")
      .required("Mobile Number is required"),
  });

  const intialValue: {
    firstName: string;
    lastName: string;
    userlogo: string;
    email: string;
    gender: string;
    mono: string;
  } = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    userlogo: user?.userlogo || "",
    email: user?.email || "",
    gender: user?.gender || "",
    mono: user?.mono || "",
  };

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
    values,
    setFieldValue,
  } = useFormik({
    initialValues: intialValue,
    validationSchema: profileSchema,
    onSubmit: async (formValues) => {
      getUpdateAdminProfile(formValues);
    },
  });

  const handleOnChange = async (e: any) => {
    if (e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      const imageRef = ref(storage, `admin_logo/${v4()}`);

      try {
        await uploadBytes(imageRef, uploadedImage);
        const imageUrl = await getDownloadURL(imageRef);

        if (imageUrl) {
          successToast("Image Upload Successfully");
          setFieldValue("userlogo", imageUrl);
        }
      } catch (error) {
        errorToast("Image Upload Failed");
      }
    }
  };

  return (
    <AdminFrame title="Profile">
      {loading && <Spinner />}
      <form className="mx-auto w-full max-w-md gap-10" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center relative bottom-6">
          <div className="border-4 h-32 w-32 p-1 border-primary rounded-full overflow-hidden">
            <Image
              className="rounded-full h-full w-full object-contain"
              src={user.userlogo || values.userlogo}
              alt="userlogo"
              width={128}
              height={128}
            />
          </div>
          <input
            type="file"
            id="userlogo"
            name="userlogo"
            accept="image/*"
            className="hidden"
            onChange={handleOnChange}
          />
          <div className="absolute  left-1/2 bottom-0 translate-x-1/2">
            <label htmlFor="userlogo" className="cursor-pointer">
              <CameraIcon />
            </label>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex w-1/2 flex-col border-2 px-2 py-1 rounded-tl-lg focus-within:border-primary">
            <label className="pb-1 text-sm font-medium">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="outline-none tracking-wider"
              placeholder="John"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstName || user?.firstName}
            />
            {touched.firstName && errors.firstName && (
              <span className="text-sm text-red-600">{errors.firstName}</span>
            )}
          </div>
          <div className="flex w-1/2 flex-col border-2 border-l-transparent px-2 py-1 rounded-tr-lg focus-within:border-primary">
            <label className="pb-1 text-sm font-medium">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="outline-none tracking-wider"
              placeholder="Doe"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastName || user?.lastName}
            />
            {touched.lastName && errors.lastName && (
              <span className="text-sm text-red-600">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col border-t-transparent border-2 px-2 py-1 focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Gender</label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={values.gender === "male" || user?.gender === "male"}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label htmlFor="male" className="ml-2">
                Male
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={values.gender === "female" || user.gender === "female"}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label htmlFor="female" className="ml-2">
                Female
              </label>
            </div>
          </div>
          {touched.gender && errors.gender && (
            <span className="text-sm text-red-600">{errors.gender}</span>
          )}
        </div>

        <div
          className={`flex flex-col border-2 border-t-transparent px-2 py-1 ${
            isDisabled ? "bg-gray-100" : ""
          } focus-within:border-primary`}
        >
          <label className="pb-1 text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            disabled={isDisabled}
            value={values.email || user.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="outline-none tracking-wider"
            placeholder="johndoe@gmail.com"
          />
          {touched.email && errors.email && (
            <span className="text-sm text-red-600">{errors.email}</span>
          )}
        </div>

        <div className="flex flex-col border-2 border-t-transparent px-2 py-1 rounded-b-lg focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Mobile No</label>
          <input
            id="mono"
            name="mono"
            type="mono"
            value={values.mono || user.mono}
            onChange={handleChange}
            maxLength={10}
            onBlur={handleBlur}
            className="outline-none tracking-wider"
            placeholder="+91 9878588845"
          />
          {touched.mono && errors.mono && (
            <span className="text-sm text-red-600">{errors.mono}</span>
          )}
        </div>

        <div className="flex flex-col border-2 mt-5 bg-primary shadow-sm rounded-lg px-2 py-2">
          <button
            type="submit"
            className="outline-none text-white font-inter font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </AdminFrame>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default AdminRoute(AdminProfile);
