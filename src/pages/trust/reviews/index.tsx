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
      {reviews.map(({ uId, reviewText, _id }, index) => (
        <div
          key={index}
          className="flex w-full flex-col justify-between md:flex-row gap-3 bg-white border shadow-md rounded-lg p-3 mb-4"
        >
          <div className="flex flex-col gap-2 justify-between w-full">
            <div className="flex items-center gap-2">
              <Image
                className="h-7 w-7 rounded-full"
                src={uId.userlogo}
                alt="User avatar"
                height={200}
                width={300}
              />
              <p className="text-black text-sm">
                {uId.firstName} {uId.lastName}
              </p>
            </div>
            <div className="w-full md:w-3/4">
              <p
                className="text-gray-600 mb-4 overflow-hidden"
                style={{ maxHeight: "3rem" }}
              >
                {reviewText}
              </p>
            </div>
          </div>
          <div className="flex gap-5 justify-between items-end">
            <div
              className="flex flex-col justify-center items-center"
              onClick={() => markAsHelpful(_id as string)}
            >
              <ThumbUpIcon isLike={helpfulStatus[_id as string]} />
              <p className="text-sm">Helpful</p>
            </div>
            <div
              className="flex flex-col justify-center items-center"
              onClick={() => markAsNotHelpful(_id as string)}
            >
              <ThumbDownIcon isLike={!helpfulStatus[_id as string]} />
              <p className="text-sm">NotHelpful</p>
            </div>
          </div>
        </div>
      ))}
    </TrustNavbar>
  );
};

export default TrustRoute(Reviews);
