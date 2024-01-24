import { useFormik } from "formik";
import CameraIcon from "@/icons/CameraIcon";
import Image from "next/image";
// import { useUser } from "@/context/user";
import AdminFrame from "@/components/AdminFrame";
import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import * as Yup from "yup";
import React, { useState } from "react";
import Cookies from "js-cookie";

const AdminProfile = () => {
  //   const { userData } = useUser();
  const [file, setFile] = useState<File | null>(null);

  const profileSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
  });

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
    values,
    setFieldValue,
  } = useFormik({
    initialValues: {
      username: "",
      email: "",
    },
    validationSchema: profileSchema,
    onSubmit: async (formValues) => {
      // Handle form submission logic
      console.log(formValues);
    },
  });

  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFieldValue("trustlogo", URL.createObjectURL(selectedFile));
    }
  };

  return (
    <AdminFrame title="Profile">
      <form className="mx-auto w-full max-w-md gap-10" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center relative bottom-6">
          <div className="border-4 h-32 w-32 p-1 border-primary rounded-full overflow-hidden">
            <Image
              className="rounded-full h-full w-full object-contain"
              src={"/placeholder-image.jpg"}
              alt="trustLogo"
              width={128}
              height={128}
            />
          </div>
          <input
            type="file"
            id="imageUpload"
            name="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImgChange}
          />
          <div className="absolute  left-1/2 bottom-0 translate-x-1/2">
            <label htmlFor="imageUpload" className="cursor-pointer">
              <CameraIcon />
            </label>
          </div>
        </div>

        <div className="flex flex-col border-2 px-2 py-1 rounded-t-lg focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className="outline-none tracking-wider"
            placeholder="Your Username"
          />
          {touched.username && errors.username && (
            <span className="text-sm text-red-600">{errors.username}</span>
          )}
        </div>

        <div className="flex flex-col border-2 border-t-transparent px-2 py-1 rounded-b-lg focus-within:border-primary">
          <label className="pb-1 text-sm font-medium">Email</label>
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

export default AdminProfile;
