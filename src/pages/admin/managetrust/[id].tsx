import AdminFrame from "@/components/AdminFrame";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BACKEND_BASE_URL } from "@/consts";
import { TrustData } from "@/types/types";
import AdminRoute from "@/components/AdminRoute";
import Spinner from "@/components/Spinner";
import { useFormik } from "formik";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import * as Yup from "yup";

const SingleTrust = () => {
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [userData, setUserData] = useState<TrustData>();
  const [image, setImage] = useState<File | null>(null);

  const validationSchema = Yup.object().shape({
    trustName: Yup.string().required("Trust name is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    founder: Yup.string().required("Founder is required"),
    contactNo: Yup.number()
      .typeError("Mobile number must be a number")
      .positive("Mobile number must be positive")
      .integer("Mobile number must be an integer")
      .nullable(),
    address: Yup.string().required("Address is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
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

  const handleOnChange = async (e: any) => {
    if (e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      setImage(uploadedImage);

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

  return (
    <AdminFrame title="Trust Detail">
      {loading && <Spinner />}
      <form onSubmit={handleSubmit} className="w-full flex flex-col my-3 gap-1">
        <div className="bg-secondary flex flex-col justify-center items-center py-5">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="trust"
              className="h-28 w-28 rounded-md"
            />
          ) : (
            <Image
              className="h-28 w-28 rounded-md"
              alt="trust Image"
              src={userData?.trustlogo as string}
              width={100}
              height={500}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleOnChange}
            className="hidden"
            id="trustlogo"
          />
          <label
            htmlFor="trustlogo"
            className="cursor-pointer bg-primary text-white p-2 mt-2 rounded-md"
          >
            Change Image
          </label>
        </div>

        <div className="flex flex-col w-full  bg-primaryLight p-2">
          <label
            htmlFor="trustName"
            className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
          >
            Trust Name
          </label>
          <input
            type="text"
            id="trustName"
            name="trustName"
            placeholder="Enter Trust Name"
            className="bg-transparent outline-none"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.trustName}
          />
          {errors.trustName && (
            <span className="text-red-500">{errors.trustName}</span>
          )}
        </div>

        <div className="flex flex-col w-full bg-primaryLight md:bg-secondary p-2">
          <label
            htmlFor="description"
            className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Enter Description"
            className="bg-transparent outline-none"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.description}
          />
          {errors.description && (
            <span className="text-red-500">{errors.description}</span>
          )}
        </div>

        <div className=" flex flex-col w-full bg-secondary md:bg-primaryLight p-2">
          <label
            htmlFor="category"
            className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            placeholder="Enter Category"
            className="bg-transparent outline-none"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.category}
          />
          {errors.category && (
            <span className="text-red-500">{errors.category}</span>
          )}
        </div>

        <div className=" flex flex-col w-full bg-primaryLight md:bg-secondary p-2">
          <label
            htmlFor="founder"
            className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
          >
            Founder
          </label>
          <input
            type="text"
            id="founder"
            name="founder"
            placeholder="Enter Founder"
            className="bg-transparent outline-none"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.founder}
          />
          {errors.founder && (
            <span className="text-red-500">{errors.founder}</span>
          )}
        </div>

        <div className=" flex flex-col w-full bg-secondary md:bg-primaryLight p-2">
          <label
            htmlFor="contactNo"
            className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
          >
            Contact No
          </label>
          <input
            type="text"
            id="contactNo"
            name="contactNo"
            maxLength={10}
            placeholder="Enter Contact No"
            className="bg-transparent outline-none"
            onChange={handleChange}
            onBlur={handleBlur}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value
                .replace(/\D/, "")
                .slice(0, 10);
              handleChange(e);
            }}
            value={values.contactNo ?? ""}
          />
          {errors.contactNo && (
            <span className="text-red-500">{errors.contactNo}</span>
          )}
        </div>

        <div className=" flex flex-col w-full bg-primaryLight md:bg-secondary p-2">
          <label
            htmlFor="address"
            className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter Address"
            className="bg-transparent outline-none"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.address}
          />
          {errors.address && (
            <span className="text-red-500">{errors.address}</span>
          )}
        </div>

        <div className=" flex flex-col w-full bg-secondary md:bg-primaryLight p-2">
          <label
            htmlFor="state"
            className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            placeholder="Enter State"
            className="bg-transparent outline-none"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.state}
          />
          {errors.state && <span className="text-red-500">{errors.state}</span>}
        </div>

        <div className=" flex flex-col w-full bg-primaryLight md:bg-secondary p-2">
          <label
            htmlFor="city"
            className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter City"
            className="bg-transparent outline-none"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.city}
          />
          {errors.city && <span className="text-red-500">{errors.city}</span>}
        </div>

        <div className=" flex flex-col w-full bg-secondary md:bg-primaryLight p-2">
          <label
            htmlFor="pincode"
            className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
          >
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            maxLength={6}
            placeholder="Enter Pincode"
            className="bg-transparent outline-none"
            onChange={handleChange}
            onBlur={handleBlur}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value
                .replace(/\D/, "")
                .slice(0, 6);
              handleChange(e);
            }}
            value={values.pincode ?? ""}
          />
          {errors.pincode && (
            <span className="text-red-500">{errors.pincode}</span>
          )}
        </div>

        <div className=" flex flex-col gap-2 mt-2 md:flex-row ">
          <div className="w-full">
            <button
              type="submit"
              className="w-full p-2 rounded-md bg-primary font-bold hover:bg-secondary text-white"
            >
              Edit
            </button>
          </div>
        </div>
      </form>
    </AdminFrame>
  );
};

export default AdminRoute(SingleTrust);
