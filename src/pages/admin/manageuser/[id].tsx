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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { toast } from "react-toastify";
import { v4 } from "uuid";
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
      setImage(uploadedImage); // Set image state with the selected file

      const imageRef = ref(storage, `trust_profile_image/${v4()}`);

      try {
        await uploadBytes(imageRef, uploadedImage);
        const imageUrl = await getDownloadURL(imageRef);

        if (imageUrl) {
          successToast("Image Upload Successfully");
          setFieldValue("userlogo", imageUrl);
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
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-1">
        <div className="bg-secondary flex flex-col justify-center items-center py-5">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="user"
              className="h-28 w-28 rounded-md"
            />
          ) : (
            <Image
              className="h-28 w-28 rounded-md"
              alt="user Image"
              src={userData?.userlogo as string}
              width={100}
              height={500}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleOnChange}
            className="hidden"
            id="userImage"
          />
          <label
            htmlFor="userImage"
            className="cursor-pointer bg-primary text-white p-2 mt-2 rounded-md"
          >
            Change Image
          </label>
        </div>
        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="flex flex-col w-full md:w-1/2 bg-primaryLight p-2">
            <label
              htmlFor="firstname"
              className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
            >
              Firstname
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter Firstname"
              className="bg-transparent outline-none"
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={inputLength}
              value={values.firstName}
            />
            {errors.firstName && (
              <span className="text-red-500">{errors.firstName}</span>
            )}
          </div>
          <div className="flex flex-col w-full md:w-1/2 bg-secondary md:bg-primaryLight p-2">
            <label
              htmlFor="lastname"
              className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
            >
              Lastname
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              maxLength={inputLength}
              placeholder="Enter Lastname"
              className="bg-transparent outline-none"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastName}
            />
            {errors.lastName && (
              <span className="text-red-500">{errors.lastName}</span>
            )}
          </div>
        </div>
        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="flex flex-col w-full bg-primaryLight md:bg-secondary p-2">
            <label
              htmlFor="email"
              className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
            >
              Email
            </label>
            <h1>{values.email}</h1>
          </div>
        </div>

        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="flex flex-col w-full bg-secondary md:bg-primaryLight p-2">
            <label className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Gender
            </label>
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.gender === "male"}
              />
              <label htmlFor="male" className="ml-2 mr-4">
                Male
              </label>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.gender === "female"}
              />
              <label htmlFor="female" className="ml-2">
                Female
              </label>
            </div>
            {errors.gender && (
              <span className="text-red-500">{errors.gender}</span>
            )}
          </div>
        </div>
        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="flex flex-col w-full bg-primaryLight md:bg-secondary p-2">
            <label
              htmlFor="mobile"
              className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
            >
              Mobile No
            </label>
            <input
              type="number"
              id="mono"
              name="mono"
              maxLength={10}
              pattern="[0-9]*"
              placeholder="Enter Mobile No"
              className="bg-transparent outline-none"
              onChange={handleChange}
              onBlur={handleBlur}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value
                  .replace(/\D/, "")
                  .slice(0, 10);
                handleChange(e);
              }}
              value={values.mono as number}
            />
            {errors.mono && <span className="text-red-500">{errors.mono}</span>}
          </div>
        </div>
        <div className="flex flex-col gap-1 md:flex-row">
          <div className="flex flex-col w-full bg-secondary md:bg-primaryLight p-2">
            <label
              htmlFor="createdate"
              className="pb-1 text-sm tracking-wider text-gray-500 font-medium"
            >
              Creation Date & Time
            </label>

            <h1>{values.createdate.toLocaleString()}</h1>
          </div>
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

export default AdminRoute(SingleUser);
