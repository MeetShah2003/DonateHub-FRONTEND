import React from "react";

interface TransactionTrustsModelProps {
  trustImage: string;
  title: string;
  description: string;
  founder: string;
  creationDate: string;
  amount: string;
}

const TransactionTrustsModel: React.FC<TransactionTrustsModelProps> = ({
  amount,
  creationDate,
  description,
  founder,
  title,
  trustImage,
}) => {
  return (
    <div className="w-full border shadow-sm rounded-md flex flex-col sm:flex-row justify-between items-center">
      <div className="flex flex-col sm:flex-row w-full">
        <div className="m-2 flex sm:flex-shrink-0">
          <img
            alt="trustImage"
            className="rounded-md sm:h-14 w-full "
            src={trustImage}
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col m-2">
          <p className="text-base font-semibold font-inter">{title}</p>
          <p
            className="text-sm font-semibold text-gray-500"
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
              WebkitLineClamp: 3,
            }}
          >
            {description}
          </p>
        </div>
      </div>
      <div className="flex w-full my-5 justify-around items-center">
        <div className="flex flex-col font-inter items-center justify-center">
          <p className="text-base">Founder</p>
          <p className="text-gray-500 text-sm">{founder}</p>
        </div>
        <div className="flex flex-col font-inter items-center justify-center">
          <p className="text-md">Creation Date</p>
          <p className="text-gray-500 text-sm">{creationDate}</p>
        </div>
        <div className="flex flex-col font-inter items-center justify-center">
          <p className="text-base">Amount</p>
          <p className="text-gray-500 text-sm">₹{amount}</p>
        </div>
      </div>
      <div className="flex w-full justify-center my-5  sm:w-fit p-2 text-white">
        <button
          onClick={() => console.log("Verify")}
          className="font-medium bg-primary py-2 px-5 rounded-sm"
        >
          Show Transaction
        </button>
      </div>
    </div>
  );
};

export default TransactionTrustsModel;
