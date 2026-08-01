import WelcomePage from "../WelcomePage";
import { useFormik } from "formik";
import CameraIcon from "@/icons/CameraIcon";
import * as Yup from "yup";
import HidePasswordIcon from "@/icons/HidePasswordIcon";
import ShowPasswordIcon from "@/icons/ShowPasswordIcon";
import React, { ReactNode, useState } from "react";
import Cookies from "js-cookie";
import {
  BACKEND_BASE_URL,
  CITY_AND_STATE,
  MAX_LENGTH,
  TRUST_CATAGORY_OPTIONS,
} from "@/consts";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { TrustData } from "@/types/types";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Spinner from "../Spinner";
import { useRouter } from "next/router";

const TrustSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [image, setImage] = useState(null);
  const [trustId, setTrustId] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { emailLength, inputLength } = MAX_LENGTH;
  const [cities, setCities] = useState<{ label: string; value: string }[]>([
    { label: "Select City", value: "" },
  ]);

  const handleOnChange = async (e: any) => {
    if (e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      try {
        const imageUrl = await uploadToCloudinary(uploadedImage, "trust-logo");

        if (imageUrl) {
          successToast("Image Upload Successfully");
          setFieldValue("trustlogo", imageUrl);
        }
      } catch (error) {
        errorToast("Image Upload Failed");
      }
    }
  };

  const [currentStep, setCurrentStep] = useState(1);
  const initialValue: TrustData = {
    _id: trustId,
    trustName: "",
    email: "",
    trustlogo: "",
    founder: "",
    creationDate: new Date(2023, 0, 1),
    category: "",
    contactNo: null,
    description: "",
    password: "",
    role: "trust",
    address: "",
    city: "",
    pincode: null,
    state: "",
    isBlocked: false,
    isVerified: false,
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
    contactNo: Yup.string().trim().required("Contact Number is required"),
    description: Yup.string().trim().required("About Trust is required"),
    password: Yup.string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    address: Yup.string().trim().required("Address is required"),
    city: Yup.string().trim().required("City is required"),
    state: Yup.string().trim().required("State is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .test("is-six-digits", "Enter 6 digits only", (value) =>
        value ? /^\d{6}$/.test(value.toString()) : true
      ),
  });

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

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

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    touched,
    errors,
    isValid,
  } = useFormik({
    initialValues: initialValue,
    validationSchema: trustDetailSchema,
    onSubmit: (value) => {
      setLoading(true);
      if (value && isValid) {
        const signUpData = JSON.stringify(value);
        Cookies.set("signup-data", signUpData);
        fetch(`${BACKEND_BASE_URL}/trust/trustSignup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message == "user already exist") {
              errorToast("email already in use");
              setTimeout(() => {
                router.push("/login");
              }, 3000);
            } else if (data.message == "trust already exist") {
              errorToast("email already in use");
              setTimeout(() => {
                router.push("/login");
              }, 3000);
            } else {
              successToast("Otp Sent Successfully");
              setTimeout(() => {
                router.push("/signup/trustotpverification");
              }, 3000);
            }
          })
          .catch(() => {
            errorToast("something went wrong");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
  });

  const handleFirstStep = () => {
    if (
      values.trustName &&
      values.email &&
      values.password &&
      values.description
    ) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      errorToast("Please fill all fields");
    }
  };

  const handleSecondStep = () => {
    if (
      values.trustName &&
      values.email &&
      values.password &&
      values.description &&
      values.category &&
      values.creationDate &&
      values.founder &&
      values.contactNo
    ) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      if (!values.category) {
        errorToast("Please Select Catagory");
      } else {
        errorToast("Please fill all fields");
      }
    }
  };

  const formSections: ReactNode[] = [
    <div key={1} className="mx-5 lg:mx-20 gap-10">
      <div className="flex flex-col border-2 px-2 py-1 rounded-t-lg focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">Trust Name</label>
        <input
          id="trustName"
          name="trustName"
          type="text"
          maxLength={inputLength}
          className="outline-none tracking-wider"
          placeholder="The Education Trust"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.trustName}
        />
        {touched.trustName && errors.trustName && (
          <span className="text-sm text-red-600">{errors.trustName}</span>
        )}
      </div>
      <div className="flex flex-col border-2 px-2 py-1 border-t-transparent focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">Trust Email</label>
        <input
          id="email"
          name="email"
          type="text"
          maxLength={emailLength}
          className="outline-none tracking-wider"
          placeholder="education@donation.com"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
        />
        {touched.email && errors.email && (
          <span className="text-sm text-red-600">{errors.email}</span>
        )}
      </div>
      <div className="flex flex-col border-t-transparent border-2 px-2 py-1 focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">Password</label>
        <div className="flex justify-between">
          <input
            id="password"
            name="password"
            minLength={8}
            maxLength={16}
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            onBlur={handleBlur}
            className="outline-none tracking-wider w-full"
            placeholder="••••••••"
          />
          <div
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
          </div>
        </div>
        {touched.password && errors.password && (
          <span className="text-sm text-red-600">{errors.password}</span>
        )}
      </div>
      <div className="flex flex-col border-2 px-2 py-1 border-t-transparent rounded-b-lg focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">About Trust</label>
        <textarea
          id="description"
          name="description"
          className="outline-none tracking-wider resize-none"
          rows={4}
          cols={30}
          maxLength={200}
          placeholder="Type Here About Trust"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.description}
        />
        {touched.description && errors.description && (
          <span className="text-sm text-red-600">{errors.description}</span>
        )}
      </div>
    </div>,
    <div key={2} className="mx-5 lg:mx-20 gap-10">
      <div className="flex flex-col border-2 px-2 py-1 rounded-t-lg focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">Category</label>
        <select
          className="outline-none tracking-wider"
          id="category"
          name="category"
          onChange={handleChange}
          onBlur={handleBlur}
        >
          {TRUST_CATAGORY_OPTIONS?.map(({ option, id }) => (
            <option key={id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
        />
      </div>
      <div className="flex flex-col border-t-transparent border-2 px-2 py-1 focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">Founder</label>
        <input
          id="founder"
          name="founder"
          type="text"
          maxLength={inputLength}
          className="outline-none tracking-wider"
          placeholder="John Doe"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.founder}
        />
        {touched.founder && errors.founder && (
          <span className="text-sm text-red-600">{errors.founder}</span>
        )}
      </div>
      <div className="flex flex-col border-t-transparent rounded-b-lg border-2 px-2 py-1 focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">Contact No</label>
        <input
          id="contactNo"
          name="contactNo"
          type="text"
          className="outline-none tracking-wider"
          placeholder="+91 0000000000"
          maxLength={10}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.contactNo as number}
        />
        {touched.contactNo && errors.contactNo && (
          <span className="text-sm text-red-600">{errors.contactNo}</span>
        )}
      </div>
    </div>,
    <div key={3} className="mx-5 lg:mx-20 gap-10">
      <div className="flex flex-col border-2 px-2 py-1 rounded-t-lg focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          className="outline-none tracking-wider"
          placeholder="A-50 , Dollar Colony"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.address}
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
        >
          {CITY_AND_STATE?.map(({ state, id }) => (
            <option key={id} value={state.value}>
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
          value={values.city}
          onBlur={handleBlur}
        >
          {cities.map(({ label, value }) => (
            <option key={value} value={value}>
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
          value={values.pincode as number}
        />
        {touched.pincode && errors.pincode && (
          <span className="text-sm text-red-600">{errors.pincode}</span>
        )}
      </div>
    </div>,
  ];

  return (
    <WelcomePage title="Welcome To" secondTitle="DonateHub">
      {loading && <Spinner />}
      <div className="max-h-[calc(100vh-2rem)] overflow-y-auto py-5">
        <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] md:p-8">
          <div className="mb-8 flex flex-col items-center gap-6">
            <div className="relative bottom-6">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-primary p-1">
                <Image
                  alt="trustlogo"
                  src={values.trustlogo}
                  className="h-full w-full rounded-full object-contain"
                  width={300}
                  height={200}
                ></Image>
              </div>
              <input
                type="file"
                id="imageUpload"
                name="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleOnChange}
              />
              <div className="absolute bottom-0 left-1/2 z-50 translate-x-1/2">
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <CameraIcon />
                </label>
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-around gap-2 rounded-2xl bg-slate-50 px-4 py-3">
                <div
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border text-sm font-bold transition hover:scale-110 ${
                    currentStep === 2 || currentStep === 3
                      ? "border-primary bg-primary text-white"
                      : "border-primary bg-white text-primary"
                  }`}
                  onClick={() => {
                    setCurrentStep(1);
                  }}
                >
                  1
                </div>
                <div className="hidden text-primary lg:block">━━━━━━━━━━━</div>
                <div className="hidden text-primary md:block lg:hidden">━━━━━━━</div>
                <div className="hidden text-primary sm:block md:hidden">
                  ━━━━━━━━━━━━━━━
                </div>
                <div className="text-primary sm:hidden">━━━━━━━━━━━</div>
                <div
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border text-sm font-bold transition hover:scale-110 ${
                    currentStep === 3
                      ? "border-primary bg-primary text-white"
                      : "border-primary bg-white text-primary"
                  }`}
                  onClick={() => {
                    if (
                      values.trustName &&
                      values.email &&
                      values.password &&
                      values.description
                    ) {
                      setCurrentStep(2);
                    } else {
                      errorToast("Please Complete Step 1");
                    }
                  }}
                >
                  2
                </div>
                <div className="hidden text-primary lg:block">━━━━━━━━━━━</div>
                <div className="hidden text-primary md:block lg:hidden">━━━━━━━</div>
                <div className="hidden text-primary sm:block md:hidden">
                  ━━━━━━━━━━━━━━━
                </div>
                <div className="text-primary sm:hidden">━━━━━━━━━━━</div>
                <div
                  onClick={() => {
                    setCurrentStep(3);
                  }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-primary bg-white text-sm font-bold text-primary transition hover:scale-110"
                >
                  3
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {formSections.map((section, index) => {
              return (
                <div
                  key={index}
                  className={`form-section ${
                    index + 1 === currentStep ? "current" : "hidden"
                  }`}
                >
                  {section}
                </div>
              );
            })}
            <div className="mt-5 flex flex-col rounded-2xl bg-primary px-2 py-3 shadow-sm">
              {currentStep === 1 && (
                <button
                  type="button"
                  className={`text-sm font-semibold text-white ${
                    currentStep !== 1 ? "hidden" : "block"
                  }`}
                  onClick={handleFirstStep}
                >
                  Next
                </button>
              )}
              {currentStep === 2 && (
                <button
                  type="button"
                  className={`text-sm font-semibold text-white ${
                    currentStep !== 2 ? "hidden" : "block"
                  }`}
                  onClick={handleSecondStep}
                >
                  Next
                </button>
              )}
              {currentStep === 3 && (
                <button
                  type="submit"
                  name="submit"
                  id="submit"
                  className={`text-sm font-semibold text-white ${
                    currentStep !== 3 ? "hidden" : "block"
                  }`}
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </WelcomePage>
  );
};

export default TrustSignup;
