import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import TrustNavbar from "../../../components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { RequestFundsForAdmin } from "@/types/types";
import UploadDocumentList from "@/components/UploadDocumentList";

const SingleAskForFunds = () => {
  const access_token = Cookies.get("access_token");
  const [loading, setLoading] = useState(false);
  const [singleRequestData, setSingleRequestData] =
    useState<RequestFundsForAdmin>();
  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);
  const { push, query } = useRouter();

  const getSingleRequestData = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/askForFundDetail/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        } else if (res && res.status === 400) {
          errorToast("Some thing went wrong");
          push(`/trust/fundrequest`);
        }
      })
      .then((data) => {
        setSingleRequestData(data.singleAskForFundDetails);
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
        } else if (res && res.status === 400) {
          errorToast("Some Thing Went Wrong");
          setTimeout(() => {
            push(`/trust/listoffundrequest`);
          }, 3000);
        }
      })
      .then((data) => {
        if (data) {
          if (data.message === "Insufficient funds") {
            errorToast("Insufficient funds");
          } else {
            successToast("Fund Request Accepted");
          }
          setTimeout(() => {
            push(`/trust/listoffundrequest`);
          }, 3000);
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
        } else if (res && res.status === 400) {
          errorToast("Some Thing Went Wrong");
          push(`/trust/listoffundrequest`);
        }
      })
      .then((data) => {
        if (data) {
          successToast("Fund Request Rejected");
          setTimeout(() => {
            push(`/trust/listoffundrequest`);
          }, 3000);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (query.id) {
      getSingleRequestData(query.id as string);
    }
  }, [query.id, access_token]);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <div>
      {loading && <Spinner />}

      <TrustNavbar title="Request Funds">
        <div className="mx-auto">
          <div>
            <div className="flex flex-col gap-5 w-full">
              <div className="w-full bg-secondary/20 border p-5">
                <p className="font-bold pb-2">Trust Name</p>
                <h1 className="text-gray-600">
                  {singleRequestData?.tId?.trustName}
                </h1>
              </div>
              <div className="w-full bg-secondary/20 border p-5">
                <p className="font-bold pb-2">Title</p>
                <h1 className="text-gray-600">{singleRequestData?.title}</h1>
              </div>
              <div className="w-full bg-secondary/20 border p-5">
                <p className="font-bold pb-2">Status</p>
                <h1 className="text-gray-600">
                  {singleRequestData?.status
                    .charAt(0)
                    .toUpperCase()
                    .concat(singleRequestData.status.slice(1))}
                </h1>
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
                    <div className="w-full border p-5">
                      <UploadDocumentList documents={singleRequestData.documents} />
                    </div>
                  )}
              </div>

              <div className="flex w-full gap-5">
                <button
                  onClick={() => {
                    fundRequestAccept(query.id as string);
                  }}
                  type="button"
                  className="w-full rounded-md bg-green-500 px-4 py-2 text-white transition hover:bg-green-400"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => {
                    fundRequestReject(query.id as string);
                  }}
                  className="w-full rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-400"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </TrustNavbar>
    </div>
  );
};

export default TrustRoute(SingleAskForFunds);
