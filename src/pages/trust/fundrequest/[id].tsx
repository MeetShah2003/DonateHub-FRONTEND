import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";
import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { Fragment } from "react";
import { useFormik } from "formik";
import DropDownArrow from "@/icons/DropDownArrow";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import TrustNavbar from "../../../components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { RequestFunds } from "@/types/types";
import firebase from "firebase/compat/app";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase";

const RequestFund = () => {
  const access_token = Cookies.get("access_token");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [singleRequestData, setSingleRequestData] = useState<RequestFunds>();
  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);
  const { push, query } = useRouter();

  const getSingleRequestData = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/fundReq/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data.singleFundReq);
        setSingleRequestData(data.singleFundReq);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fundRequestAccept = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/accptFundReq/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          console.log(data);
          successToast("Fund Request Accepted");
          push(`/trust/fundrequest`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fundRequestReject = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/rejFundReq/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          console.log(data);
          successToast("Fund Request Rejected");
          push(`/trust/fundrequest`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const DownloadImages = async (imageUrls: string[]) => {
    setLoading(true);
    try {
      for (const imageUrl of imageUrls) {
        const imageRef = ref(storage, imageUrl);
        const downloadURL = await getDownloadURL(imageRef);
        window.open(downloadURL, "_blank");
      }
    } catch (error) {
      console.error("Error downloading images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleRequestData(query.id as string);
  }, []);

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
    onSubmit: async (values) => {
      console.log("values", query);
    },
  });

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <div>
      {loading && <Spinner />}

      <TrustNavbar title="Request Funds">
        <div className="mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5 w-full">
              <div className="w-full bg-secondary/20 border p-5">
                <p className="font-bold pb-2">Select Trust</p>
                <h1 className="text-gray-600">{singleRequestData?.tId}</h1>
              </div>
              <div className="w-full bg-secondary/20 border p-5">
                <p className="font-bold pb-2">Title</p>
                <h1 className="text-gray-600">{singleRequestData?.title}</h1>
              </div>
              <div className="w-full bg-secondary/20 border p-5">
                <p className="font-bold pb-2">Description</p>
                <h1 className="text-gray-600">
                  {singleRequestData?.description}
                </h1>
              </div>
              <div className="w-full bg-secondary/20 border p-5">
                <p className="font-bold pb-2">Amount</p>
                <h1 className="text-gray-600">
                  ₹{formatAmount(singleRequestData?.reqAmount)}
                </h1>
              </div>
              <div className="w-full bg-secondary/20 border p-5">
                <p className="font-bold pb-2">Upload Documents</p>

                {Array.isArray(singleRequestData?.documents) &&
                  singleRequestData?.documents.length > 0 && (
                    <div className="w-full  border p-5">
                      <div className="flex flex-wrap gap-2">
                        {singleRequestData?.documents.map((document, index) => (
                          <Image
                            height={100}
                            width={100}
                            key={index}
                            src={document}
                            alt="documents"
                            onClick={() => {
                              DownloadImages(singleRequestData.documents);
                            }}
                            className="max-w-xs border rounded-md max-h-40"
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </div>
              <div className="flex w-full gap-5">
                <button
                  onClick={() => {
                    fundRequestAccept(query.id as string);
                  }}
                  type="button"
                  className="bg-green-500 hover:bg-green-400 w-full text-white py-2 px-4 rounded-md hover:bg-primary-dark"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => {
                    fundRequestReject(query.id as string);
                  }}
                  className="bg-red-500 hover:bg-red-400 w-full text-white py-2 px-4 rounded-md hover:bg-primary-dark"
                >
                  Reject
                </button>
              </div>
            </div>
          </form>
        </div>
      </TrustNavbar>
    </div>
  );
};

export default TrustRoute(RequestFund);
