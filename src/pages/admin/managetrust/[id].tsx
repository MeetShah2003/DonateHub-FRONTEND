import AdminFrame from "@/components/AdminFrame";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  BACKEND_BASE_URL,
  CITY_AND_STATE,
  MAX_LENGTH,
  TRUST_CATAGORY_OPTIONS,
} from "@/consts";
import { TrustData } from "@/types/types";
import AdminRoute from "@/components/AdminRoute";
import Spinner from "@/components/Spinner";
import { useFormik } from "formik";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "react-toastify";
import * as Yup from "yup";

const SingleTrust = () => {
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [userData, setUserData] = useState<TrustData>();
  const { emailLength, inputLength } = MAX_LENGTH;
  const [image, setImage] = useState<File | null>(null);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([
    { label: "Select City", value: "" },
  ]);

  const validationSchema = Yup.object().shape({
    trustName: Yup.string().trim().required("Trust name is required"),
    description: Yup.string().trim().required("Description is required"),
    category: Yup.string().trim().required("Category is required"),
    founder: Yup.string().trim().required("Founder is required"),
    contactNo: Yup.number()
      .typeError("Mobile number must be a number")
      .positive("Mobile number must be positive")
      .integer("Mobile number must be an integer")
      .nullable(),
    address: Yup.string().trim().required("Address is required"),
    state: Yup.string().trim().required("State is required"),
    city: Yup.string().trim().required("City is required"),
    pincode: Yup.number()
      .typeError("Pincode must be a number")
      .positive("Pincode must be positive")
      .integer("Pincode must be an integer")
      .nullable(),
  });

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const initialValues: TrustData = {
    trustlogo: "",
    trustName: "",
    description: "",
    category: "",
    creationDate: new Date(),
    founder: "",
    contactNo: null,
    address: "",
    state: "",
    city: "",
    pincode: null,
  };

  const {
    handleSubmit,
    handleBlur,
    handleChange,
    setValues,
    setFieldValue,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues,
    onSubmit: (value) => {
      console.log(value);
      editUserData(query.id as string, value as TrustData);
    },
    validationSchema,
  });

  const getSingleTrust = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/singleTrust/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data.singlePageTrust);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editUserData = (id: string, updData: TrustData) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/edtTrust/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(updData),
    })
      .then((res) => {
        if (res && res.status === 200) {
          getSingleTrust(query?.id as string);
          successToast("Trust Data Edited");
        }
      })
      .catch(() => {
        errorToast("");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getSingleTrust(query?.id as string);
  }, [access_token]);

  useEffect(() => {
    if (userData) {
      setValues(userData);
    }
  }, [userData]);

  // const handleOnChange = async (e: any) => {
  //   if (e.target.files[0]) {
  //     const uploadedImage = e.target.files[0];
  //     setImage(uploadedImage);

  //     const imageRef = ref(storage, `trust_profile_image/${v4()}`);

  //     try {
  //       await uploadBytes(imageRef, uploadedImage);
  //       const imageUrl = await getDownloadURL(imageRef);

  //       if (imageUrl) {
  //         successToast("Image Upload Successfully");
  //         setFieldValue("trustlogo", imageUrl);
  //       }
  //     } catch (error) {
  //       errorToast("Image Upload Failed");
  //     }
  //   }
  // };

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

  const handleOnChange = async (e: any) => {
    if (e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      setImage(uploadedImage);

      try {
        const imageUrl = await uploadToCloudinary(uploadedImage, "trust-logo", access_token);

        if (imageUrl) {
          successToast("Image Upload Successfully");

          // Update form values with new image URL
          setValues((prevValues) => ({
            ...prevValues,
            trustlogo: imageUrl,
          }));
        }
      } catch (error) {
        errorToast("Image Upload Failed");
      }
    }
  };

  return (
    <AdminFrame title="Trust Detail">
      {loading && <Spinner />}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-primary to-slate-900 p-6 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Trust Profile
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{values.trustName || "Trust profile"}</h2>
              </div>
              <div className="flex items-center gap-3">
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="trust" className="h-20 w-20 rounded-2xl border border-white/30 object-cover" />
                ) : (
                  <Image className="h-20 w-20 rounded-2xl border border-white/30 object-cover" alt="trust Image" src={userData?.trustlogo as string} width={100} height={100} />
                )}
                <label htmlFor="trustlogo" className="cursor-pointer rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
                  Change Image
                </label>
              </div>
            </div>
            <input type="file" accept="image/*" onChange={handleOnChange} className="hidden" id="trustlogo" />
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="trustName" className="pb-1 text-sm font-medium text-slate-500">Trust Name</label>
              <input type="text" id="trustName" name="trustName" placeholder="Enter Trust Name" className="bg-transparent text-base font-medium text-slate-900 outline-none" onChange={handleChange} onBlur={handleBlur} maxLength={inputLength} value={values.trustName} />
              {errors.trustName && <span className="mt-1 text-sm text-red-500">{errors.trustName}</span>}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="category" className="pb-1 text-sm font-medium text-slate-500">Category</label>
              <select className="bg-transparent text-base font-medium text-slate-900 outline-none" id="category" name="category" onChange={handleChange} onBlur={handleBlur} value={values.category}>
                {TRUST_CATAGORY_OPTIONS?.map(({ option }, index) => (
                  <option key={index} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.category && <span className="mt-1 text-sm text-red-500">{errors.category}</span>}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <label htmlFor="description" className="pb-1 text-sm font-medium text-slate-500">Description</label>
              <textarea id="description" name="description" rows={4} maxLength={500} placeholder="Enter Description" className="bg-transparent text-base text-slate-700 outline-none" onChange={handleChange} onBlur={handleBlur} value={values.description} />
              {errors.description && <span className="mt-1 text-sm text-red-500">{errors.description}</span>}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="founder" className="pb-1 text-sm font-medium text-slate-500">Founder</label>
              <input type="text" id="founder" name="founder" placeholder="Enter Founder" className="bg-transparent text-base font-medium text-slate-900 outline-none" onChange={handleChange} onBlur={handleBlur} value={values.founder} maxLength={inputLength} />
              {errors.founder && <span className="mt-1 text-sm text-red-500">{errors.founder}</span>}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="contactNo" className="pb-1 text-sm font-medium text-slate-500">Contact No</label>
              <input type="text" id="contactNo" name="contactNo" maxLength={10} placeholder="Enter Contact No" className="bg-transparent text-base font-medium text-slate-900 outline-none" onChange={handleChange} onBlur={handleBlur} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/, "").slice(0, 10); handleChange(e); }} value={values.contactNo ?? ""} />
              {errors.contactNo && <span className="mt-1 text-sm text-red-500">{errors.contactNo}</span>}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="address" className="pb-1 text-sm font-medium text-slate-500">Address</label>
              <input type="text" id="address" name="address" maxLength={inputLength} placeholder="Enter Address" className="bg-transparent text-base font-medium text-slate-900 outline-none" onChange={handleChange} onBlur={handleBlur} value={values.address} />
              {errors.address && <span className="mt-1 text-sm text-red-500">{errors.address}</span>}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="state" className="pb-1 text-sm font-medium text-slate-500">State</label>
              <select className="bg-transparent text-base font-medium text-slate-900 outline-none" id="state" name="state" onChange={(e) => handleStateChange(e.target.value)} onBlur={handleBlur} value={values.state}>
                {CITY_AND_STATE?.map(({ state }, index) => (
                  <option key={index} value={state.value}>{state.label}</option>
                ))}
              </select>
              {touched.state && errors.state && <span className="mt-1 text-sm text-red-600">{errors.state}</span>}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="city" className="pb-1 text-sm font-medium text-slate-500">City</label>
              <select className="bg-transparent text-base font-medium text-slate-900 outline-none" id="city" name="city" onChange={handleChange} value={values.city} onBlur={handleBlur}>
                {cities.map(({ label, value }, index) => (
                  <option key={index} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="pincode" className="pb-1 text-sm font-medium text-slate-500">Pincode</label>
              <input type="text" id="pincode" name="pincode" maxLength={6} placeholder="Enter Pincode" className="bg-transparent text-base font-medium text-slate-900 outline-none" onChange={handleChange} onBlur={handleBlur} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/, "").slice(0, 6); handleChange(e); }} value={values.pincode ?? ""} />
              {errors.pincode && <span className="mt-1 text-sm text-red-500">{errors.pincode}</span>}
            </div>
          </div>

          <div className="border-t border-slate-200 p-6">
            <button type="submit" className="w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/90">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </AdminFrame>
  );
};

export default AdminRoute(SingleTrust);
