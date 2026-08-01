import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { BACKEND_BASE_URL } from "@/consts";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ReviewsForTrust } from "@/types/types";
import ThumbUpIcon from "@/icons/ThumbUpIcon";
import ThumbDownIcon from "@/icons/ThumbDownIcon";

const Reviews = () => {
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [reviews, setReviews] = useState<ReviewsForTrust[]>([]);
  const [helpfulStatus, setHelpfulStatus] = useState<{
    [key: string]: boolean;
  }>({}); // State to track helpful status of each review

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/myReviews`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          setReviews(data.myReviews);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleHelpfulStatus = (reviewId: string) => {
    setHelpfulStatus((prevStatus) => ({
      ...prevStatus,
      [reviewId]: !prevStatus[reviewId], // Toggle the helpful status of the review
    }));
  };

  const markAsHelpful = (reviewId: string) => {
    toggleHelpfulStatus(reviewId); // Toggle the helpful status locally

    // Send API request to update the helpful status on the backend
    fetch(`${BACKEND_BASE_URL}/trust/usefullMark/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to mark as helpful");
        }
      })
      .catch((error) => {
        console.error(error);
        // Revert the change on failure
        toggleHelpfulStatus(reviewId);
      });
  };

  const markAsNotHelpful = (reviewId: string) => {
    toggleHelpfulStatus(reviewId); // Toggle the helpful status locally

    // Send API request to update the helpful status on the backend
    fetch(`${BACKEND_BASE_URL}/trust/notUsefullMark/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to mark as not helpful");
        }
      })
      .catch((error) => {
        console.error(error);
        // Revert the change on failure
        toggleHelpfulStatus(reviewId);
      });
  };

  return (
    <TrustNavbar title="Reviews">
      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4">
          {reviews.map(({ uId, reviewText, _id }, index) => (
            <div
              key={index}
              className="flex w-full flex-col justify-between gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 md:flex-row"
            >
              <div className="flex w-full flex-col justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Image
                    className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                    src={uId.userlogo}
                    alt="User avatar"
                    height={200}
                    width={300}
                  />
                  <p className="text-sm font-semibold text-slate-900">
                    {uId.firstName} {uId.lastName}
                  </p>
                </div>
                <div className="w-full md:w-3/4">
                  <p className="break-words whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {reviewText}
                  </p>
                </div>
              </div>
              <div className="flex items-end justify-between gap-5 md:flex-col md:items-center">
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-full px-3 py-2 transition hover:bg-white"
                  onClick={() => markAsHelpful(_id as string)}
                >
                  <ThumbUpIcon isLike={helpfulStatus[_id as string]} />
                  <p className="text-xs text-slate-600">Helpful</p>
                </div>
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-full px-3 py-2 transition hover:bg-white"
                  onClick={() => markAsNotHelpful(_id as string)}
                >
                  <ThumbDownIcon isLike={!helpfulStatus[_id as string]} />
                  <p className="text-xs text-slate-600">Not Helpful</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TrustNavbar>
  );
};

export default TrustRoute(Reviews);
