import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";
import { BACKEND_BASE_URL } from "@/consts";
import { TrustData } from "@/types/types";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import DropDownArrow from "@/icons/DropDownArrow";
import * as Yup from "yup";
import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";

const RequestFunds = () => {
  const access_token = Cookies.get("access_token");
  const [trusts, setTrusts] = useState<TrustData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TrustData | null>(null);

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/allTrustsV`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTrusts(data.verifiedTrusts);
      });
  }, [access_token]);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  const validationSchema = Yup.object({
    tId: Yup.string().required("Trust is required"),
    title: Yup.string().required("Title is required"),
    description: Yup.string()
      .required("Description is required")
      .min(150, "Description must be at least 150 characters"),
    reqAmount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be greater than zero"),
  });

  const { push } = useRouter();

  const {
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetForm,
    errors,
    touched,
    values,
  } = useFormik({
    initialValues: {
      tId: "",
      title: "",
      description: "",
      reqAmount: null,
      documents: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      fetch(`${BACKEND_BASE_URL}/api/askForFund`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          successToast("Fund Request Send Successfully");
          resetForm();
          setTimeout(() => {
            push(`/dashboard`);
          }, 3000);
        })
        .catch(() => {
          errorToast("Something went wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: TrustData) => {
    setSelectedOption(option);
    setIsOpen(false);
    setFieldValue("tId", option._id);
  };

  const handleFileUpload = async (event: any) => {
    setLoading(true);
    const files = event.target.files;
    const uploadedURLs = [];

    for (const file of files) {
      const documentRef = ref(storage, `fund_request_documents/${v4()}`);
      try {
        await uploadBytes(documentRef, file);
        const downloadURL = await getDownloadURL(documentRef);
        uploadedURLs.push(downloadURL);
      } catch (error) {
        console.error("Error uploading document:", error);
      } finally {
        setLoading(false);
      }
    }

    setFieldValue("documents", [...values.documents, ...uploadedURLs]);
  };

  return (
    <div>
      {loading && <Spinner />}
      <div className="navbar sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      <div className="max-w-screen-lg w-90% mx-auto py-10">
        <h1 className="my-5 text-2xl font-semibold">Request Funds</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5 w-full">
            <div className="w-full bg-secondary/20 border p-5">
              <p className="font-bold pb-2">Select Trust</p>
              <div className="relative w-full">
                <div>
                  <span className="rounded-md shadow-sm">
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      id="options-menu"
                      aria-haspopup="true"
                      aria-expanded="true"
                    >
                      <span className="flex items-center">
                        {selectedOption ? (
                          <>
                            <Image
                              src={selectedOption.trustlogo}
                              alt={`Image for ${selectedOption.trustName}`}
                              className="h-6 w-6 mr-2"
                              width={200}
                              height={300}
                            />
                            <span>{selectedOption.trustName}</span>
                          </>
                        ) : (
                          "Select an option"
                        )}
                      </span>
                      <DropDownArrow />
                    </button>
                  </span>
                </div>

                {isOpen && (
                  <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {trusts.map((option, index) => (
                        <>
                          {!option.isBlocked && option.isVerified && (
                            <button
                              key={index}
                              className="flex items-center border-b w-full text-left gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              role="menuitem"
                              onClick={() => selectOption(option)}
                            >
                              <Image
                                height={100}
                                width={100}
                                src={option.trustlogo}
                                alt={`Image for ${option.trustName}`}
                                className="h-16 w-16 mr-2 border"
                              />
                              <p className="font-bold">{option.trustName}</p>
                            </button>
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                )}
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
                name="reqAmount"
                id="reqAmount"
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
                value={values.reqAmount || ""}
              />
              {touched.reqAmount && errors.reqAmount && (
                <div className="text-red-500">{errors.reqAmount}</div>
              )}
            </div>

            <div className="w-full bg-secondary/20 border p-5">
              <p className="font-bold pb-2">Upload Documents</p>
              <input
                type="file"
                className="border-2 w-full shadow-sm outline-none rounded-md p-2"
                name="documents"
                id="documents"
                onChange={handleFileUpload}
                multiple
                accept="*/*"
              />
              {Array.isArray(values.documents) &&
                values.documents.length > 0 && (
                  <div className="w-full bg-secondary/20 border p-5">
                    <p className="font-bold pb-2">Uploaded Documents:</p>
                    <div className="flex flex-wrap gap-2">
                      {values.documents.map((document, index) => (
                        <Image
                          height={100}
                          width={100}
                          key={index}
                          src={document}
                          alt="documents"
                          className="max-w-xs border rounded-md max-h-40"
                        />
                      ))}
                    </div>
                  </div>
                )}
            </div>
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRoute(RequestFunds);
