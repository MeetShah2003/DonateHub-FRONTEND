import { useFormik } from "formik";
import CameraIcon from "@/icons/CameraIcon";
import Image from "next/image";
import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/context/auth";
import {
  BACKEND_BASE_URL,
  CITY_AND_STATE,
  TRUST_CATAGORY_OPTIONS,
} from "@/consts";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { v4 } from "uuid";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { TrustData } from "@/types/types";
import TrustNavbar from "@/components/TrustNavbar";

const ProfileTrust = () => {
  const { user } = useAuth();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [cities, setCities] = useState<{ label: string; value: string }[]>([
    { label: "Select City", value: "" },
  ]);

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const getUpdatedTrustProfile = (data: TrustData) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/updTrust`, {
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

  const trustDetailSchema = Yup.object().shape({
    trustName: Yup.string().trim().required("Trust Name is required"),
    trustlogo: Yup.string().trim().required("Trust Logo is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    founder: Yup.string().trim().required("Founder is required"),
    creationDate: Yup.date()
      .required("Creation Date is required")
      .max(new Date(), "Creation Date must be in the past"),
    category: Yup.string().trim().required("Category is required"),
    contactNo: Yup.string().required("Contact Number is required"),
    description: Yup.string().trim().required("About Trust is required"),
    address: Yup.string().trim().required("Address is required"),
    city: Yup.string().trim().required("City is required"),
    state: Yup.string().trim().required("State is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .test("is-six-digits", "Pincode must be exactly 6 digits", (value) =>
        value ? /^\d{6}$/.test(value.toString()) : true
      ),
  });

  const initialValue: TrustData = {
    trustName: user?.trustName || "",
    trustlogo: user?.trustlogo || "",
    email: user?.email || "",
    contactNo: user?.contactNo || "",
    description: user?.description || "",
    category: user?.category || "",
    creationDate: user?.creationDate || "",
    founder: user?.founder || "",
    address: user?.address || "",
    state: user?.state || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
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
    initialValues: initialValue,
    validationSchema: trustDetailSchema,
    onSubmit: async (formValues) => {
      console.log(formValues);
      getUpdatedTrustProfile(formValues);
    },
  });

  const handleOnChange = async (e: any) => {
    if (e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      const imageRef = ref(storage, `trust_profile_image/${v4()}`);

      try {
        await uploadBytes(imageRef, uploadedImage);
        const imageUrl = await getDownloadURL(imageRef);

        if (imageUrl) {
          successToast("Image Upload Successfully");
          setFieldValue("trustlogo", imageUrl);
        }
      } catch (error) {
        errorToast("Image Upload Failed");
      }
    }
  };

  const handleStateChange = (selectedState: string) => {
    values.state = selectedState;

    const selectedStateObject = CITY_AND_STATE.find(
      (stateObj) => stateObj.state.value === selectedState
    );

    const selectedStateCities = selectedStateObject
      ? selectedStateObject.city
      : [];

    setCities(selectedStateCities);
  };

  useEffect(() => {
    handleStateChange(values.state);
  }, [values.state]);

  return (
    <div>
      <div>
        <TrustNavbar title="Edit Profile">
          {loading && <Spinner />}
          <form
            className="mx-auto w-full max-w-md gap-10"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-center relative bottom-6">
              <div className="border-4 h-32 w-32 p-1 border-primary rounded-full overflow-hidden">
                <Image
                  className="rounded-full h-full w-full object-contain"
                  src={user.userlogo || values.trustlogo}
                  alt="trustlogo"
                  width={128}
                  height={128}
                />
              </div>
              <input
                type="file"
                id="trustlogo"
                name="trustlogo"
                accept="image/*"
                className="hidden"
                onChange={handleOnChange}
              />
              <div className="absolute left-1/2 bottom-0 translate-x-1/2">
                <label htmlFor="trustlogo" className="cursor-pointer">
                  <CameraIcon />
                </label>
              </div>
            </div>

            <div className="flex w-full flex-col border-2 px-2 py-1 rounded-t-lg focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">Trust Name</label>
              <input
                id="trustName"
                name="trustName"
                type="text"
                className="outline-none tracking-wider"
                placeholder="John"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.trustName || user?.trustName}
              />
              {touched.trustName && errors.trustName && (
                <span className="text-sm text-red-600">{errors.trustName}</span>
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
                value={user.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="outline-none tracking-wider"
                placeholder="johndoe@gmail.com"
              />
              {touched.email && errors.email && (
                <span className="text-sm text-red-600">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col border-2 px-2 py-1 border-t-transparent focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">About Trust</label>
              <textarea
                id="description"
                name="description"
                className="outline-none tracking-wider resize-none"
                rows={4}
                cols={30}
                placeholder="Type Here About Trust"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description || user.description}
              />
              {touched.description && errors.description && (
                <span className="text-sm text-red-600">
                  {errors.description}
                </span>
              )}
            </div>

            <div className="flex flex-col border-2 px-2 py-1 border-t-transparent focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">Category</label>
              <select
                className="outline-none tracking-wider"
                id="category"
                name="category"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.category || user?.category}
              >
                {TRUST_CATAGORY_OPTIONS?.map(({ option }, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col border-2 border-t-transparent px-2 py-1 focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">Mobile No</label>
              <input
                id="contactNo"
                name="contactNo"
                type="text"
                value={values.contactNo || user.contactNo}
                onChange={handleChange}
                maxLength={10}
                onBlur={handleBlur}
                className="outline-none tracking-wider"
                placeholder="+91 9878588845"
              />
              {touched.contactNo && errors.contactNo && (
                <span className="text-sm text-red-600">{errors.contactNo}</span>
              )}
            </div>

            <div className="flex flex-col border-t-transparent border-2 px-2 py-1 focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">Creation Date</label>
              <input
                id="creationDate"
                name="creationDate"
                type="date"
                className="outline-none select-none tracking-wider"
                placeholder="John Doe"
                onChange={handleChange}
                onBlur={handleBlur}
                max={new Date().toISOString().split("T")[0]}
                value={values.creationDate || user?.creationDate}
              />
            </div>

            <div className="flex flex-col border-t-transparent border-2 px-2 py-1 focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">Founder</label>
              <input
                id="founder"
                name="founder"
                type="text"
                className="outline-none tracking-wider"
                placeholder="John Doe"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.founder || user?.founder}
              />
              {touched.founder && errors.founder && (
                <span className="text-sm text-red-600">{errors.founder}</span>
              )}
            </div>

            <div className="flex flex-col border-2 px-2 py-1 border-t-transparent focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                className="outline-none tracking-wider"
                placeholder="A-50 , Dollar Colony"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address || user?.address}
              />
              {touched.address && errors.address && (
                <span className="text-sm text-red-600">{errors.address}</span>
              )}
            </div>

            <div className="flex flex-col border-2 px-2 py-1 border-t-transparent focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">State</label>
              <select
                className="outline-none tracking-wider"
                id="state"
                name="state"
                onChange={(e) => handleStateChange(e.target.value)}
                onBlur={handleBlur}
                value={values.state || user?.state}
              >
                {CITY_AND_STATE?.map(({ state }, index) => (
                  <option key={index} value={state.value}>
                    {state.label}
                  </option>
                ))}
                {touched.state && errors.state && (
                  <span className="text-sm text-red-600">{errors.state}</span>
                )}
              </select>
            </div>

            <div className="flex flex-col border-2 px-2 py-1 border-t-transparent focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">City</label>
              <select
                className="outline-none tracking-wider"
                id="city"
                name="city"
                onChange={handleChange}
                value={values.city || user?.city}
                onBlur={handleBlur}
              >
                {cities.map(({ label, value }, index) => (
                  <option key={index} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col border-t-transparent rounded-b-lg border-2 px-2 py-1 focus-within:border-primary">
              <label className="pb-1 text-sm font-medium">Pincode</label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                className="outline-none tracking-wider"
                placeholder="395004"
                maxLength={6}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.pincode || user?.pincode}
              />
              {touched.pincode && errors.pincode && (
                <span className="text-sm text-red-600">{errors.pincode}</span>
              )}
            </div>

            <div className="flex flex-col border-2 mt-5 bg-primary shadow-sm rounded-lg px-2 py-2">
              <button
                type="submit"
                name="submit"
                className="outline-none text-white font-inter font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        </TrustNavbar>
      </div>
    </div>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;

export default TrustRoute(ProfileTrust);
