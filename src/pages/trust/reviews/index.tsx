import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { BACKEND_BASE_URL } from "@/consts";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ReviewsForTrust } from "@/types/types";

const Reviews = () => {
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [reviews, setReviews] = useState<ReviewsForTrust[]>();

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
          console.log(data);
          setReviews(data.myReviews);
        }
      });
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <TrustNavbar title="Reviews">
      {reviews &&
        reviews.length &&
        reviews.map(({ uId, reviewText }) => {
          return (
            <div className="flex w-full flex-col justify-between md:flex-row gap-3 bg-white border shadow-md rounded-lg p-3 mb-4">
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
            </div>
          );
        })}
    </TrustNavbar>
  );
};

export default TrustRoute(Reviews);
