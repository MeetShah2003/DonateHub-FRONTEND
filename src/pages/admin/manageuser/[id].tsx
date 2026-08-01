import AdminFrame from "@/components/AdminFrame";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BACKEND_BASE_URL, MAX_LENGTH } from "@/consts";
import { UserData } from "@/types/types";
import AdminRoute from "@/components/AdminRoute";
import Spinner from "@/components/Spinner";
import { useFormik } from "formik";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "react-toastify";
import * as Yup from "yup";

const SingleUser = () => {
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const { emailLength, inputLength } = MAX_LENGTH;
  const [userData, setUserData] = useState<UserData>();
  const [image, setImage] = useState<File | null>(null);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().trim().required("First name is required"),
    lastName: Yup.string().trim().required("Last name is required"),
    gender: Yup.string().trim().required("Gender is required"),
    mono: Yup.number()
      .typeError("Mobile number must be a number")
      .positive("Mobile number must be positive")
      .integer("Mobile number must be an integer")
      .nullable(),
  });

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const initialValues: {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    mono: number | null;
    createdate: string;
    userlogo: string;
  } = {
    createdate: "",
    email: "",
    gender: "",
    mono: null,
    userlogo: "",
    firstName: "",
    lastName: "",
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
      const { createdate, email, ...data } = value;
      editUserData(
        query.id as string,
        data as {
          userlogo: string;
          firstName: string;
          lastName: string;
          gender: string;
          mono: number;
        }
      );
    },
    validationSchema,
  });

  const getSingleUser = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/singleUser/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data.singlePageUser);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editUserData = (
    id: string,
    updData: {
      userlogo: string;
      firstName: string;
      lastName: string;
      gender: string;
      mono: number;
    }
  ) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/edtUser/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(updData),
    })
      .then((res) => {
        if (res && res.status === 200) {
          getSingleUser(query?.id as string);
          successToast("User Data Edited");
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
    getSingleUser(query?.id as string);
  }, [access_token]);

  useEffect(() => {
    if (userData) {
      setValues({
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdate: userData.createdAt.toString(),
        email: userData.email,
        gender: userData.gender,
        mono: userData.mono,
        userlogo: userData.userlogo,
      });
    }
  }, [userData]);

  const handleOnChange = async (e: any) => {
    if (e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      setImage(uploadedImage);

      try {
        const imageUrl = await uploadToCloudinary(uploadedImage, "user-profile", access_token);

        if (imageUrl) {
          successToast("Image Upload Successfully");

          // Update form values with new image URL
          setValues((prevValues) => ({
            ...prevValues,
            userlogo: imageUrl,
          }));

          // Update the src attribute of the Image component directly
          const imageElement = document.getElementById(
            "userImage"
          ) as HTMLImageElement;
          if (imageElement) {
            imageElement.src = imageUrl;
          }
        }
      } catch (error) {
        errorToast("Image Upload Failed");
      }
    }
  };

  console.log(values.createdate);

  return (
    <AdminFrame title="User Detail">
      {loading && <Spinner />}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-primary to-slate-900 p-6 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">User Profile</p>
                <h2 className="mt-2 text-2xl font-semibold">{`${values.firstName} ${values.lastName}`}</h2>
              </div>
              <div className="flex items-center gap-3">
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="user" className="h-20 w-20 rounded-2xl border border-white/30 object-cover" />
                ) : (
                  <Image className="h-20 w-20 rounded-2xl border border-white/30 object-cover" alt="User Image" src={(values.userlogo as string) || (userData?.userlogo as string)} width={100} height={100} />
                )}
                <label htmlFor="userImage" className="cursor-pointer rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">Change Image</label>
              </div>
            </div>
            <input type="file" accept="image/*" onChange={handleOnChange} className="hidden" id="userImage" />
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="firstName" className="pb-1 text-sm font-medium text-slate-500">First Name</label>
              <input type="text" id="firstName" name="firstName" placeholder="Enter Firstname" className="bg-transparent text-base font-medium text-slate-900 outline-none" onChange={handleChange} onBlur={handleBlur} maxLength={inputLength} value={values.firstName} />
              {errors.firstName && <span className="mt-1 text-sm text-red-500">{errors.firstName}</span>}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="lastName" className="pb-1 text-sm font-medium text-slate-500">Last Name</label>
              <input type="text" id="lastName" name="lastName" maxLength={inputLength} placeholder="Enter Lastname" className="bg-transparent text-base font-medium text-slate-900 outline-none" onChange={handleChange} onBlur={handleBlur} value={values.lastName} />
              {errors.lastName && <span className="mt-1 text-sm text-red-500">{errors.lastName}</span>}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="email" className="pb-1 text-sm font-medium text-slate-500">Email</label>
              <div className="text-base font-medium text-slate-900">{values.email}</div>
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="pb-1 text-sm font-medium text-slate-500">Gender</label>
              <div className="flex items-center gap-4 text-sm text-slate-700">
                <label className="flex items-center gap-2"><input type="radio" id="male" name="gender" value="male" onChange={handleChange} onBlur={handleBlur} checked={values.gender === "male"} />Male</label>
                <label className="flex items-center gap-2"><input type="radio" id="female" name="gender" value="female" onChange={handleChange} onBlur={handleBlur} checked={values.gender === "female"} />Female</label>
              </div>
              {errors.gender && <span className="mt-1 text-sm text-red-500">{errors.gender}</span>}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="mono" className="pb-1 text-sm font-medium text-slate-500">Mobile No</label>
              <input type="text" id="mono" name="mono" maxLength={10} pattern="[0-9]*" placeholder="Enter Mobile No" className="bg-transparent text-base font-medium text-slate-900 outline-none" onChange={handleChange} onBlur={handleBlur} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/, "").slice(0, 10); handleChange(e); }} value={values.mono as number} />
              {errors.mono && <span className="mt-1 text-sm text-red-500">{errors.mono}</span>}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="createdate" className="pb-1 text-sm font-medium text-slate-500">Creation Date & Time</label>
              <div className="text-base font-medium text-slate-900">{values.createdate.toLocaleString()}</div>
            </div>
          </div>

          <div className="border-t border-slate-200 p-6">
            <button type="submit" className="w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/90">Save Changes</button>
          </div>
        </div>
      </form>
    </AdminFrame>
  );
};

export default AdminRoute(SingleUser);
