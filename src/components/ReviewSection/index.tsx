import { BACKEND_BASE_URL } from "@/consts";
import LikeIcon from "@/icons/LikeIcon";
import ThumbUpIcon from "@/icons/ThumbUpIcon";
import ThumbDownIcon from "@/icons/ThumbDownIcon";
import { useFormik } from "formik";
import Cookies from "js-cookie";

import Image from "next/image";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { ReviewType } from "@/types/types";
import { toast } from "react-toastify";

const ReviewSection: React.FC<{ trustId: string }> = ({ trustId }) => {
  const [loading, setLoading] = useState(false);
  const [allReviews, setAllReviews] = useState<ReviewType[]>([]);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([]);
  const [notHelpfulReviews, setNotHelpfulReviews] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const [helpfulCounts, setHelpfulCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [notHelpfulCounts, setNotHelpfulCounts] = useState<{
    [key: string]: number;
  }>({});
  const access_token = Cookies.get("access_token");

  const errorToast = (errorMessage: string) => toast.error(errorMessage);
  const successToast = (successMessage: string) =>
    toast.success(successMessage);

  const markAsHelpful = (reviewId: string) => {
    if (!helpfulReviews.includes(reviewId)) {
      setHelpfulReviews([...helpfulReviews, reviewId]);
      setNotHelpfulReviews(notHelpfulReviews.filter((id) => id !== reviewId));

      fetch(`${BACKEND_BASE_URL}/api/helpfullCount/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            // Update the count only after receiving the response
            return res.json();
          }
          throw new Error("Failed to mark as helpful");
        })
        .then((data) => {
          console.log(data.review.helpfulCount);

          setHelpfulCounts((prevCounts) => ({
            ...prevCounts,
            [reviewId]: (prevCounts[reviewId] || 0) + 1, // Increment the count
          }));
        })
        .catch((error) => {
          errorToast("Something went wrong");
          console.error(error);
        });
    } else {
      // If already marked as helpful, decrement the count and remove from helpfulReviews
      setHelpfulReviews(helpfulReviews.filter((id) => id !== reviewId));
      setHelpfulCounts((prevCounts) => ({
        ...prevCounts,
        [reviewId]: Math.max((prevCounts[reviewId] || 0) - 1, 0), // Decrement the count but ensure it doesn't go below 0
      }));
    }
  };

  const markAsNotHelpful = (reviewId: string) => {
    if (!notHelpfulReviews.includes(reviewId)) {
      setNotHelpfulReviews([...notHelpfulReviews, reviewId]);
      setHelpfulReviews(helpfulReviews.filter((id) => id !== reviewId));

      fetch(`${BACKEND_BASE_URL}/api/notHelpfullCount/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            // Update the count only after receiving the response
            return res.json();
          }
          throw new Error("Failed to mark as not helpful");
        })
        .then((data) => {
          console.log(data.review.notHelpfulCount);
          setNotHelpfulCounts((prevCounts) => ({
            ...prevCounts,
            [reviewId]: (prevCounts[reviewId] || 0) + 1, // Increment the count
          }));
        })
        .catch((error) => {
          errorToast("Something went wrong");
          console.error(error);
        });
    } else {
      // If already marked as not helpful, decrement the count and remove from notHelpfulReviews
      setNotHelpfulReviews(notHelpfulReviews.filter((id) => id !== reviewId));
      setNotHelpfulCounts((prevCounts) => ({
        ...prevCounts,
        [reviewId]: Math.max((prevCounts[reviewId] || 0) - 1, 0), // Decrement the count but ensure it doesn't go below 0
      }));
    }
  };
  const writeReview = (id: string, reviewText: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/api/trustReview`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ trustId: id, reviewText }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          showReviews(trustId);
        }
      })
      .catch(() => {
        errorToast("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to fetch and display reviews
  // Function to fetch and display reviews
  const showReviews = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/api/allTrustReviews/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to fetch reviews");
      })
      .then((data) => {
        console.log(data);
        setAllReviews(data.allReviews);
        const counts: { [key: string]: number } = {};
        const helpfulCounts: { [key: string]: number } = {};
        const notHelpfulCounts: { [key: string]: number } = {};
        data.allReviews.forEach((review: any) => {
          counts[review._id] = review.likes;
          helpfulCounts[review._id] = review.helpfulCount;
          notHelpfulCounts[review._id] = review.notHelpfulCount;
        });
        setLikeCounts(counts);
        setHelpfulCounts(helpfulCounts);
        setNotHelpfulCounts(notHelpfulCounts);
      })
      .catch((error) => {
        errorToast("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (trustId) {
      showReviews(trustId);
    }
  }, [trustId]);

  const { handleSubmit, handleBlur, handleChange, values, errors, touched } =
    useFormik({
      initialValues: {
        review: "",
      },
      onSubmit: (value) => {
        if (trustId && value.review) {
          writeReview(trustId, value.review);
        }
      },
    });

  const toggleLike = (reviewId: string) => {
    if (likedReviews.includes(reviewId)) {
      setLikedReviews(likedReviews.filter((id) => id !== reviewId));
      // Call API to remove like
      fetch(`${BACKEND_BASE_URL}/api/dislikeReview/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Failed to unlike review");
        })
        .then(() => {
          setLikeCounts((prevCounts) => ({
            ...prevCounts,
            [reviewId]: prevCounts[reviewId] - 1,
          }));
        })
        .catch(() => {
          errorToast("something went wrong");
        });
    } else {
      setLikedReviews([...likedReviews, reviewId]);
      // Call API to add like
      fetch(`${BACKEND_BASE_URL}/api/likeReview/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Failed to like review");
        })
        .then(() => {
          setLikeCounts((prevCounts) => ({
            ...prevCounts,
            [reviewId]: prevCounts[reviewId] + 1,
          }));
        })
        .catch(() => {
          errorToast("Something went wrong");
        });
    }
  };

  return (
    <div className="w-full">
      {loading && <Spinner />}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="w-full rounded-[20px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <p className="pb-2 text-sm font-semibold text-slate-900">Write a Review</p>
          <textarea
            className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary"
            name="review"
            id="review"
            placeholder="Write a Review"
            onChange={handleChange}
            onBlur={handleBlur}
            minLength={150}
            maxLength={500}
            value={values.review}
          />
          {touched.review && errors.review && (
            <div className="text-red-500">{errors.review}</div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white py-2 px-10 rounded-md hover:bg-primary-dark"
          >
            Publish
          </button>
        </div>
      </form>
      {allReviews.map(({ uId, reviewText, _id }, index) => (
        <div
          key={index}
          className="my-5 flex min-w-0 flex-col gap-3 overflow-hidden rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Image
              alt="userImage"
              className="h-9 w-9 rounded-full border border-slate-200 object-cover object-center"
              src={uId?.userlogo}
              width={100}
              height={100}
            />
            <p className="text-sm font-medium text-slate-500">
              {uId?.firstName} {uId?.lastName}
            </p>
          </div>
          <p className="min-w-0 break-words whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {reviewText}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
            <div
              onClick={() => toggleLike(_id)}
              className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition hover:bg-slate-100"
            >
              <LikeIcon isLike={likedReviews.includes(_id)} />
              <p className="text-sm text-gray-500">{likeCounts[_id]}</p>
            </div>
            <div
              onClick={() => markAsHelpful(_id)}
              className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition hover:bg-slate-100"
            >
              <ThumbUpIcon isLike={helpfulReviews.includes(_id)} />
              <p className="text-sm text-gray-500">{helpfulCounts[_id]}</p>
            </div>
            <div
              onClick={() => markAsNotHelpful(_id)}
              className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition hover:bg-slate-100"
            >
              <ThumbDownIcon isLike={notHelpfulReviews.includes(_id)} />
              <p className="text-sm text-gray-500">{notHelpfulCounts[_id]}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewSection;
