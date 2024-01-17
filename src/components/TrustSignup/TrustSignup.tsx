import WelcomePage from "../WelcomePage";
import { useFormik } from "formik";
import CameraIcon from "@/icons/CameraIcon";
import * as Yup from "yup";
import HidePasswordIcon from "@/icons/HidePasswordIcon";
import ShowPasswordIcon from "@/icons/ShowPasswordIcon";
import React, { ChangeEvent, ReactNode, useState } from "react";
import { CITY_AND_STATE, TRUST_CATAGORY_OPTIONS } from "@/consts";
import { toast } from "react-toastify";
import ToastMessage from "../ToastMessage";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

const TrustSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [trustId, setTrustId] = useState(uuidv4());
  const [cities, setCities] = useState<{ label: string; value: string }[]>([
    { label: "Select City", value: "" },
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const initialValue: {
    trustId: string;
    trustname: string;
    trustlogo: string;
    trustemail: string;
    founder: string;
    creationdate: Date;
    catagory: string;
    contactno: number;
    abouttrust: string;
    password: string;
    address: {
      address: string;
      city: string;
      state: string;
      pincode: number;
    };
    role: string;
  } = {
    trustId: trustId,
    trustname: "",
    trustemail: "",
    trustlogo:
      "https://tse1.mm.bing.net/th?id=OIP.TpqSE-tsrMBbQurUw2Su-AHaHk&pid=Api&P=0&h=180",
    founder: "",
    creationdate: new Date(2023, 0, 1),
    catagory: "",
    contactno: 0,
    abouttrust: "",
    password: "",
    role: "trust",
    address: {
      address: "",
      city: "",
      pincode: 0,
      state: "",
    },
  };

  const trustDetailSchema = Yup.object().shape({
    trustname: Yup.string().trim().required("Trust Name is required"),
    trustlogo: Yup.string().trim().required("Trust Logo is required"),
    trustemail: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    founder: Yup.string().trim().required("Founder is required"),
    creationdate: Yup.date()
      .required("Creation Date is required")
      .max(new Date(), "Creation Date must be in the past"),
    catagory: Yup.string().trim().required("Category is required"),
    contactno: Yup.number().required("Contact Number is required"),
    abouttrust: Yup.string().trim().required("About Trust is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    role: Yup.string()
      .trim()
      .oneOf(["trust"], "Invalid Role")
      .required("Role is required"),
    address: Yup.object().shape({
      address: Yup.string().trim().required("Address is required"),
      city: Yup.string().trim().required("City is required"),
      state: Yup.string().trim().required("State is required"),
      pincode: Yup.number()
        .required("Pincode is required")
        .test("is-six-digits", "Pincode must be exactly 6 digits", (value) =>
          value ? /^\d{6}$/.test(value.toString()) : true
        ),
    }),
  });

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const handleStateChange = (selectedState: string) => {
    values.address.state = selectedState;
    setSelectedState(selectedState);

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
    onSubmit: () => {
      if (values && isValid) {
        // console.log("values>>", values);        
        console.log("Submitted Values:", values);
        successToast("Account Is Successfully Created");
      } else {
        errorToast("Please Check Form");
      }
    },
  });

  // const handleFileChange = (event: ChangeEvent) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFieldValue("trustlogo", reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //     successToast("Image Uploaded Successfully");
  //   }
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("trustlogo", reader.result);
        console.log("imageUrl>>", reader.result);
      };
      reader.readAsDataURL(file);
      successToast("Image Uploaded Successfully");
    }
  };

  // const handleFileChange = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = event.target?.files?.[0];
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append("trustlogo", file);

  //     try {
  //       const response = await fetch(
  //         "http://localhost:8090/trust/trustSignup",
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );

  //       if (response.ok) {
  //         const result = await response.json();
  //         setFieldValue("trustlogo", result.imageUrl);
  //         successToast("Image Uploaded Successfully");
  //       } else {
  //         errorToast("Failed to upload image");
  //       }
  //     } catch (error) {
  //       console.error("Error uploading image:", error);
  //       errorToast("Error uploading image");
  //     }
  //   }
  // };

  const handleFirstStep = () => {
    if (
      values.trustname &&
      values.trustemail &&
      values.password &&
      values.abouttrust
    ) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      errorToast("Please fill all fields");
    }
  };

  const handleSecondStep = () => {
    if (
      values.trustname &&
      values.trustemail &&
      values.password &&
      values.abouttrust &&
      values.catagory &&
      values.creationdate &&
      values.founder &&
      values.contactno
    ) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      if (!values.catagory) {
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
          id="trustname"
          name="trustname"
          type="text"
          className="outline-none tracking-wider"
          placeholder="The Education Trust"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.trustname}
        />
        {touched.trustname && errors.trustname && (
          <span className="text-sm text-red-600">{errors.trustname}</span>
        )}
      </div>
      <div className="flex flex-col border-2 px-2 py-1 border-t-transparent focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">Trust Email</label>
        <input
          id="trustemail"
          name="trustemail"
          type="text"
          className="outline-none tracking-wider"
          placeholder="education@donation.com"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.trustemail}
        />
        {touched.trustemail && errors.trustemail && (
          <span className="text-sm text-red-600">{errors.trustemail}</span>
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
          id="abouttrust"
          name="abouttrust"
          className="outline-none tracking-wider resize-none"
          rows={4}
          cols={30}
          placeholder="Type Here About Trust"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.abouttrust}
        />
        {touched.abouttrust && errors.abouttrust && (
          <span className="text-sm text-red-600">{errors.abouttrust}</span>
        )}
      </div>
    </div>,
    <div key={2} className="mx-5 lg:mx-20 gap-10">
      <div className="flex flex-col border-2 px-2 py-1 rounded-t-lg focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">Category</label>
        <select
          className="outline-none tracking-wider"
          id="catagory"
          name="catagory"
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
          id="creationdate"
          name="creationdate"
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
          id="contactno"
          name="contactno"
          type="number"
          className="outline-none tracking-wider"
          placeholder="+91 0000000000"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.contactno}
        />
        {touched.contactno && errors.contactno && (
          <span className="text-sm text-red-600">{errors.contactno}</span>
        )}
      </div>
    </div>,
    <div key={3} className="mx-5 lg:mx-20 gap-10">
      <div className="flex flex-col border-2 px-2 py-1 rounded-t-lg focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">Address</label>
        <input
          id="address.address"
          name="address.address"
          type="text"
          className="outline-none tracking-wider"
          placeholder="A-50 , Dollar Colony"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.address.address}
        />
        {touched.address?.address && errors.address?.address && (
          <span className="text-sm text-red-600">
            {errors.address?.address}
          </span>
        )}
      </div>
      <div className="flex flex-col border-2 px-2 py-1 border-t-transparent focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">State</label>
        <select
          className="outline-none tracking-wider"
          id="address.state"
          name="address.state"
          onChange={(e) => handleStateChange(e.target.value)}
          onBlur={handleBlur}
        >
          {CITY_AND_STATE?.map(({ state, id }) => (
            <option key={id} value={state.value}>
              {state.label}
            </option>
          ))}
          {touched.address?.city && errors.address?.city && (
            <span className="text-sm text-red-600">{errors.address.state}</span>
          )}
        </select>
      </div>
      <div className="flex flex-col border-2 px-2 py-1 border-t-transparent focus-within:border-primary">
        <label className="pb-1 text-sm font-medium">City</label>
        <select
          className="outline-none tracking-wider"
          id="address.city"
          name="address.city"
          onChange={handleChange}
          value={values.address.city}
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
          id="address.pincode"
          name="address.pincode"
          type="number"
          className="outline-none tracking-wider"
          placeholder="395004"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.address.pincode}
        />
        {touched.address?.pincode && errors.address?.pincode && (
          <span className="text-sm text-red-600">
            {errors.address?.pincode}
          </span>
        )}
      </div>
    </div>,
  ];

  return (
    <WelcomePage>
      <ToastMessage />
      <div className="mx-5 lg:mx-20 mb-10 flex flex-col justify-center items-center gap-8">
        {/* <div className="relative bottom-6">
          <div className="border-4 h-32 w-32 p-1 border-primary rounded-full overflow-hidden">
            <img
              className="rounded-full h-full w-full object-contain"
              src="https://tse1.mm.bing.net/th?id=OIP.ZNqde0PLHfVg1j1I-2G9xQHaHa&pid=Api&P=0&h=180"
              alt=""
            />
          </div>
          <div className="absolute z-50  left-1/2 bottom-0 translate-x-1/2 ">
            <CameraIcon />
          </div>
        </div> */}
        <div className="relative bottom-6">
          <div className="border-4 h-32 w-32 p-1 border-primary rounded-full overflow-hidden">
            <Image
              className="rounded-full h-full w-full object-contain"
              src={values.trustlogo}
              alt="trustLogo"
            />
          </div>
          <input
            type="file"
            id="imageUpload"
            name="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="absolute z-50  left-1/2 bottom-0 translate-x-1/2 ">
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
          <div className="text-primary">━━━━━━━━━━━━━━━</div>
          <div
            className={`h-8 w-8 flex items-center cursor-pointer hover:scale-125 transition-transform ease-in-out justify-center font-bold rounded-full text-primary border ${
              currentStep === 3
                ? "text-white bg-primary"
                : "text-primary border-primary"
            }`}
            onClick={() => {
              if (
                values.trustname &&
                values.trustemail &&
                values.password &&
                values.abouttrust
              ) {
                setCurrentStep(2);
              } else {
                errorToast("Please Complete Step 1");
              }
            }}
          >
            2
          </div>
          <div className="text-primary">━━━━━━━━━━━━━━━</div>

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
