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
  TRUST_CATAGORY_OPTIONS,
} from "@/consts";
import { toast } from "react-toastify";
import { v4 as uuidv4, v4 } from "uuid";
import Image from "next/image";
import { TrustData } from "@/types/types";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Spinner from "../Spinner";
import { useRouter } from "next/router";

const TrustSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [image, setImage] = useState(null);
  const [trustId, setTrustId] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [cities, setCities] = useState<{ label: string; value: string }[]>([
    { label: "Select City", value: "" },
  ]);

  const handleOnChange = async (e: any) => {
    if (e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      const imageRef = ref(storage, `trust_logos/${v4()}`);

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
    contactNo: Yup.string().required("Contact Number is required"),
    description: Yup.string().trim().required("About Trust is required"),
    password: Yup.string()
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
      .test("is-six-digits", "Pincode must be exactly 6 digits", (value) =>
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
      <div className="mx-5 lg:mx-20 mb-10 flex flex-col justify-center items-center gap-8">
        {/* <div className="relative bottom-6">
          <div className="border-4 h-32 w-32 p-1 border-primary rounded-full overflow-hidden">
            <Image
              className="rounded-full h-full w-full object-contain"
              src={values.trustlogo}
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
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <div className="absolute z-50  left-1/2 bottom-0 translate-x-1/2 ">
            <label htmlFor="imageUpload" className="cursor-pointer">
              <CameraIcon />
            </label>
          </div>
        </div> */}
        <div className="relative bottom-6">
          <div className="border-4 h-32 w-32 p-1 border-primary rounded-full overflow-hidden">
            <Image
              alt="trustlogo"
              src={values.trustlogo}
              className="rounded-full h-full w-full object-contain"
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
          <div className="absolute z-50 left-1/2 bottom-0 translate-x-1/2">
            <label htmlFor="imageUpload" className="cursor-pointer">
              <CameraIcon />
            </label>
          </div>
        </div>

        <div className="w-full flex justify-around">
          <div
            className={`h-8 w-8 flex items-center hover:scale-125 transition-transform ease-in-out cursor-pointer justify-center font-bold rounded-full border ${
              currentStep === 2 || currentStep === 3
                ? "text-white bg-primary"
                : "text-primary border-primary"
            }`}
            onClick={() => {
              setCurrentStep(1);
            }}
          >
            1
          </div>
          <div className="hidden lg:block text-primary">━━━━━━━━━━━</div>
          <div className="hidden md:block lg:hidden text-primary">━━━━━━━</div>
          <div className="hidden sm:block md:hidden text-primary">
            ━━━━━━━━━━━━━━━
          </div>
          <div className=" text-primary sm:hidden">━━━━━━━━━━━</div>
          <div
            className={`h-8 w-8 flex items-center cursor-pointer hover:scale-125 transition-transform ease-in-out justify-center font-bold rounded-full text-primary border ${
              currentStep === 3
                ? "text-white bg-primary"
                : "text-primary border-primary"
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
          <div className="hidden lg:block text-primary">━━━━━━━━━━━</div>
          <div className="hidden md:block lg:hidden text-primary">━━━━━━━</div>
          <div className="hidden sm:block md:hidden text-primary">
            ━━━━━━━━━━━━━━━
          </div>
          <div className=" text-primary sm:hidden">━━━━━━━━━━━</div>

          <div
            onClick={() => {
              setCurrentStep(3);
            }}
            className="h-8 w-8 flex cursor-pointer items-center hover:scale-125 transition-transform ease-in-out justify-center font-bold rounded-full text-primary border border-primary bg-white"
          >
            3
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
        <div className="flex flex-col mx-5 lg:mx-20 gap-10 border-2 mt-5 bg-primary shadow-sm rounded-lg px-2 py-2">
          {currentStep === 1 && (
            <button
              type="button"
              className={`outline-none ${
                currentStep !== 1 ? "hidden" : "block"
              } text-white font-inter font-medium`}
              onClick={handleFirstStep}
            >
              Next
            </button>
          )}
          {currentStep === 2 && (
            <button
              type="button"
              className={`outline-none ${
                currentStep !== 2 ? "hidden" : "block"
              } text-white font-inter font-medium`}
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
              className={`outline-none ${
                currentStep !== 3 ? "hidden" : "block"
              } text-white font-inter font-medium`}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </WelcomePage>
  );
};

export default TrustSignup;
