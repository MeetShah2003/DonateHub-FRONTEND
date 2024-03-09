import { BACKEND_BASE_URL } from "@/consts";
import LikeIcon from "@/icons/LikeIcon";
import { useFormik } from "formik";
import Cookies from "js-cookie";

import Image from "next/image";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { ReviewType } from "@/types/types";

const ReviewSection: React.FC<{ trustId: string }> = ({ trustId }) => {
  const [loading, setLoading] = useState(false);
  const [allReviews, setAllReviews] = useState<ReviewType[]>([]);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const access_token = Cookies.get("access_token");

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
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          showReviews(trustId);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        setAllReviews(data.allReviews);
        const counts: { [key: string]: number } = {};
        data.allReviews.forEach((review: any) => {
          counts[review._id] = review.likes;
        });
        setLikeCounts(counts);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
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
        .catch((error) => {
          console.error("Error unliking review:", error);
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
        .catch((error) => {
          console.error("Error liking review:", error);
        });
    }
  };

  return (
    <div className="w-full">
      {loading && <Spinner />}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="w-full bg-secondary/20 rounded-md border p-5">
          <p className="font-bold pb-2">Write a Review</p>
          <textarea
            className="border-2 w-full shadow-sm outline-none rounded-md p-2"
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
          className="flex flex-col gap-2 w-full bg-white border p-3 my-5 rounded-md shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Image
              alt="userImage"
              className="w-7 h-7 rounded-full border object-cover object-center"
              src={uId?.userlogo}
              width={100}
              height={100}
            />
            <p className="text-gray-400 text-sm">
              {uId?.firstName} {uId?.lastName}
            </p>
          </div>
          <div className="w-full flex items-end justify-between">
            <p className="w-[90%] font-inter">{reviewText}</p>
            <div
              onClick={() => toggleLike(_id)}
              className="flex cursor-pointer justify-end gap-2 w-[10%] items-center"
            >
              <LikeIcon isLike={likedReviews.includes(_id)} />
              <p className="text-gray-500">{likeCounts[_id]}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewSection;
