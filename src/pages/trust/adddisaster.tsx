import Spinner from "@/components/Spinner";
import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { BACKEND_BASE_URL } from "@/consts";
import { useAuth } from "@/context/auth";
import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useFormik } from "formik";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const AddDisaster = () => {
  const { user } = useAuth();
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string()
      .required("Description is required")
      .min(150, "Description must be at least 150 characters")
      .max(500, "Description must be at most 500 characters"),
    targetFund: Yup.number()
      .required("Target fund is required")
      .min(0, "Target fund must be a positive number or zero"),
    altContact: Yup.string().required("Alternate contact is required"),
    endDate: Yup.date()
      .required("End date is required")
      .min(new Date(), "End date must be in the future"),
  });

  const initialValue: {
    tId: string;
    targetFund: number;
    endDate: Date;
    title: string;
    description: string;
    altContact: number;
    disasterImage: string;
  } = {
    tId: user?._id,
    altContact: null || 0,
    description: "",
    endDate: new Date(),
    targetFund: null || 0,
    title: "",
    disasterImage: "",
  };
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    setFieldValue,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: initialValue,
    onSubmit: (data) => {
      setLoading(true);
      fetch(`${BACKEND_BASE_URL}/trust/fundRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res && res.status === 200) {
            return res.json();
          }
        })
        .then((data) => {
          if (data) {
            successToast("Disaster Added Successfully");
            push("/trust");
          }
        })
        .catch((err) => {
          errorToast("Something Went Wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    validationSchema,
  });

  const handleOnChange = async (e: any) => {
    setLoading(true);
    if (e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      const imageRef = ref(storage, `disaster_image/${v4()}`);

      try {
        await uploadBytes(imageRef, uploadedImage);
        const imageUrl = await getDownloadURL(imageRef);

        if (imageUrl) {
          successToast("Image Upload Successfully");
          setFieldValue("disasterImage", imageUrl);
        }
      } catch (error) {
        errorToast("Image Upload Failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <TrustNavbar title="Add Disaster">
      {loading && <Spinner />}
      <div className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <div className="bg-secondary/20 flex flex-col p-5 items-center">
              <p className="w-full font-bold pb-2">Upload Image</p>

              <div className=" h-40 w-44 p-1 overflow-hidden">
                <Image
                  className="border-2 border-primary p-2 h-full w-full object-cover object-center"
                  src={values?.disasterImage}
                  alt="trustlogo"
                  width={500}
                  height={500}
                />
              </div>
              <div className="flex flex-col mt-5">
                <label
                  htmlFor="documents"
                  className="text-primary cursor-pointer"
                >
                  <span className="bg-primary text-white px-4 py-2 rounded-md shadow-md">
                    Upload Image
                  </span>
                  <input
                    type="file"
                    id="documents"
                    name="documents"
                    className="hidden"
                    multiple
                    accept="*/*"
                    onChange={handleOnChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="w-full bg-secondary/20 border p-5">
            <p className="font-bold pb-2">Title</p>
            <input
              type="text"
              className="border-2 w-full shadow-sm outline-none rounded-md p-2"
              name="title"
              id="title"
              placeholder="Enter Title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
            />
            {touched.title && errors.title && (
              <div className="text-red-500">{errors.title}</div>
            )}
          </div>

          <div className="w-full bg-secondary/20 border p-5">
            <p className="font-bold pb-2">Description</p>
            <textarea
              className="border-2 w-full shadow-sm outline-none rounded-md p-2"
              name="description"
              id="description"
              placeholder="why need funds?"
              onChange={handleChange}
              onBlur={handleBlur}
              minLength={150}
              maxLength={500}
              value={values.description}
            />
            {touched.description && errors.description && (
              <div className="text-red-500">{errors.description}</div>
            )}
          </div>

          <div className="w-full bg-secondary/20 border p-5">
            <p className="font-bold pb-2">Tartget Funds</p>
            <input
              type="number"
              className="border-2 w-full shadow-sm outline-none rounded-md p-2"
              name="targetFund"
              id="targetFund"
              placeholder="₹5000"
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault(); // Prevent the default behavior of increasing/decreasing the value
                }
              }}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.length > 6) {
                  e.target.value = e.target.value.slice(0, 6);
                }
              }}
              value={values.targetFund || ""}
            />
            {touched.targetFund && errors.targetFund && (
              <div className="text-red-500">{errors.targetFund}</div>
            )}
          </div>

          <div className="w-full bg-secondary/20 border p-5">
            <p className="font-bold pb-2">Contact No</p>
            <input
              type="number"
              className="border-2 w-full shadow-sm outline-none rounded-md p-2"
              name="altContact"
              id="altContact"
              placeholder="+91 9858988854"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.altContact}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault(); // Prevent the default behavior of increasing/decreasing the value
                }
              }}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.length > 10) {
                  e.target.value = e.target.value.slice(0, 10);
                }
              }}
            />
            {touched.altContact && errors.altContact && (
              <div className="text-red-500">{errors.altContact}</div>
            )}
          </div>

          <div className="w-full bg-secondary/20 border p-5">
            <p className="font-bold pb-2">End Date</p>
            <input
              type="date"
              className="border-2 w-full shadow-sm outline-none rounded-md p-2"
              name="endDate"
              id="endDate"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.endDate.toString()}
            />
            {touched.endDate && errors.endDate && (
              <div className="text-red-500">{errors.endDate as string}</div>
            )}
          </div>

          <div className="w-full">
            <button
              type="submit"
              className="bg-primary w-full text-white rounded-lg p-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </TrustNavbar>
  );
};

export default TrustRoute(AddDisaster);
