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
  MAX_LENGTH,
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
  const { emailLength, inputLength } = MAX_LENGTH;
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
      .then((res) => res.json())
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
      .trim()
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
          <form className="mx-auto w-full gap-10" onSubmit={handleSubmit}>
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

            <div className="flex flex-col gap-5 lg:flex-row w-full">
              <div className="flex flex-col justify-end gap-5 w-full">
                <div className="flex flex-col gap-1">
                  <label
                    className="w-full font-inter text-base font-semibold leading-4 tracking-heading text-black"
                    htmlFor="trustName"
                  >
                    Trustname
                  </label>
                  <input
                    className={
                      "w-full rounded-lg placeholder:text-gray-650  border-2 border-gray-300 font-inter py-3 px-3 mb-4 sm:mb-0 text-base font-normal leading-4 outline-none"
                    }
                    type="text"
                    id="trustName"
                    name="trustName"
                    placeholder="First name"
                    maxLength={inputLength}
                    value={values.trustName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.trustName && errors.trustName && (
                    <span className="text-sm text-red-600">
                      {errors.trustName}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="w-full font-inter text-base font-semibold leading-4 tracking-heading text-black"
                    htmlFor="firstName"
                  >
                    Email
                  </label>
                  <input
                    className={`w-full ${
                      isDisabled ? "bg-gray-200" : ""
                    } rounded-lg  placeholder:text-gray-650 border-2 border-gray-300 font-inter py-3 px-3 mb-4 sm:mb-0 text-base font-normal leading-4 outline-none`}
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    disabled={isDisabled}
                    maxLength={emailLength}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email && (
                    <span className="text-sm text-red-600">{errors.email}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="w-full font-inter text-base font-semibold leading-4 tracking-heading text-black"
                    htmlFor="email"
                  >
                    Mobile No
                  </label>
                  <input
                    className={
                      "w-full rounded-lg placeholder:text-gray-650  border-2 border-gray-300 font-inter py-3 px-3 mb-4 sm:mb-0 text-base font-normal leading-4 outline-none"
                    }
                    type="text"
                    id="contactNo"
                    name="contactNo"
                    placeholder="ContactNo"
                    value={values.contactNo as number}
                    maxLength={10}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.contactNo && errors.contactNo && (
                    <span className="text-sm text-red-600">
                      {errors.contactNo}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="w-full font-inter text-base font-semibold leading-4 tracking-heading text-black"
                    htmlFor="email"
                  >
                    Creation Date
                  </label>
                  <input
                    className={
                      "w-full rounded-lg placeholder:text-gray-650  border-2 border-gray-300 font-inter py-3 px-3 mb-4 sm:mb-0 text-base font-normal leading-4 outline-none"
                    }
                    type="text"
                    id="creationDate"
                    name="creationDate"
                    placeholder="creationDate"
                    maxLength={inputLength}
                    max={new Date().toISOString().split("T")[0]}
                    value={values.creationDate.toString() || user?.creationDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="w-full font-inter text-base font-semibold leading-4 tracking-heading text-black"
                    htmlFor="email"
                  >
                    Catagory
                  </label>
                  <select
                    className="w-full rounded-lg placeholder:text-gray-650  border-2 border-gray-300 font-inter py-3 px-3 mb-4 sm:mb-0 text-base font-normal leading-4 outline-none"
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
                  {touched.category && errors.category && (
                    <span className="text-sm text-red-600">
                      {errors.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="w-full font-inter text-base font-semibold leading-4 tracking-heading text-black"
                    htmlFor="email"
                  >
                    Founder
                  </label>
                  <input
                    className={
                      "w-full rounded-lg placeholder:text-gray-650  border-2 border-gray-300 font-inter py-3 px-3 mb-4 sm:mb-0 text-base font-normal leading-4 outline-none"
                    }
                    type="text"
                    id="founder"
                    name="founder"
                    placeholder="Founder"
                    value={values.founder}
                    maxLength={inputLength}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.founder && errors.founder && (
                    <span className="text-sm text-red-600">
                      {errors.founder}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col px-2 border-t-transparent focus-within:border-primary">
                  <label className="pb-1 text-sm font-medium">
                    About Trust
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full rounded-lg placeholder:text-gray-650  border-2 border-gray-300 font-inter py-3 px-3 mb-4 sm:mb-0 text-base font-normal leading-4 outline-none"
                    rows={6}
                    cols={30}
                    maxLength={500}
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
                <div className="flex flex-col px-2 border-t-transparent focus-within:border-primary">
                  <label className="pb-1 text-sm font-medium">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="w-full rounded-lg placeholder:text-gray-650  border-2 border-gray-300 font-inter py-3 px-3 mb-4 sm:mb-0 text-base font-normal leading-4 outline-none"
                    placeholder="A-50 , Dollar Colony"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address || user?.address}
                  />
                  {touched.address && errors.address && (
                    <span className="text-sm text-red-600">
                      {errors.address}
                    </span>
                  )}
                </div>
                <div className="flex flex-col px-2  border-t-transparent focus-within:border-primary">
                  <label className="pb-1 text-sm font-medium">State</label>
                  <select
                    className="w-full rounded-lg placeholder:text-gray-650  border-2 border-gray-300 font-inter py-3 px-3 mb-4 sm:mb-0 text-base font-normal leading-4 outline-none"
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
                      <span className="text-sm text-red-600">
                        {errors.state}
                      </span>
                    )}
                  </select>
                </div>
                <div className="flex flex-col px-2 border-t-transparent focus-within:border-primary">
                  <label className="pb-1 text-sm font-medium">City</label>
                  <select
                    className="w-full rounded-lg placeholder:text-gray-650  border-2 border-gray-300 font-inter py-3 px-3 mb-4 sm:mb-0 text-base font-normal leading-4 outline-none"
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

                <div className="flex flex-col border-t-transparent rounded-b-lg px-2 focus-within:border-primary">
                  <label className="pb-1 text-sm font-medium">Pincode</label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    className="w-full rounded-lg placeholder:text-gray-650  border-2 border-gray-300 font-inter py-3 px-3 mb-4 sm:mb-0 text-base font-normal leading-4 outline-none"
                    placeholder="395004"
                    maxLength={6}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.pincode || user?.pincode}
                  />
                  {touched.pincode && errors.pincode && (
                    <span className="text-sm text-red-600">
                      {errors.pincode}
                    </span>
                  )}
                </div>
              </div>
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
