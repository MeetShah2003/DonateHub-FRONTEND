import LikeIcon from "@/icons/LikeIcon";
import { useFormik } from "formik";

import Image from "next/image";
import { useState } from "react";
const ReviewSection = () => {
  const [isLike, setIsLike] = useState(false);
  const { handleSubmit, handleBlur, handleChange, values, errors, touched } =
    useFormik({
      initialValues: {
        review: "",
      },
      onSubmit: (value) => {
        console.log(value);
      },
    });
  return (
    <div className="w-full">
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
      <div className="flex flex-col gap-2 w-full bg-white border p-3 my-5 rounded-md shadow-sm">
        <div className="flex items-center gap-3">
          <Image
            alt="userImage"
            className="w-7 h-7 rounded-full border object-cover object-center"
            src={
              "https://firebasestorage.googleapis.com/v0/b/donatehub-d09f5.appspot.com/o/user_profile_image%2F15005e78-0bfe-430f-9d87-43480140b374?alt=media&token=8ecadb77-4a07-40d3-9ee9-9617ce5157c0"
            }
            width={100}
            height={100}
          />
          <p className="text-gray-400 text-sm">Darshan Prajapati</p>
        </div>
        <div className="w-full flex items-end justify-between">
          <p className="w-[90%] font-inter">
            This trust is very help full trust Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Eum, enim?This trust is very help full
            trust Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum,
            enim?This trust is very help full trust Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Eum, enim?This trust is very help full
            trust Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum,
            enim?This trust is very help full trust Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Eum, enim?
          </p>
          <div
            onClick={() => {
              setIsLike(!isLike);
            }}
            className="flex justify-end gap-2 w-[10%] items-center"
          >
            <LikeIcon isLike={isLike} />
            <p className="text-gray-500">5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
