import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "@/context/auth";
import items from "razorpay/dist/types/items";

interface TransactionTrustsModelProps {
  trustImage: string;
  title: string;
  description: string;
  founder: string;
  creationDate: Date;
  amount: number;
  fundRequirement?: number;
  statusOfModel?: string;
  onShowTransaction: () => void;
  onEditDisaster?: () => void;
}

const formatAmount = (amount: any) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};

const TransactionTrustsModel: React.FC<TransactionTrustsModelProps> = ({
  amount,
  creationDate,
  description,
  founder,
  title,
  trustImage,
  statusOfModel,
  fundRequirement,
  onShowTransaction,
  onEditDisaster,
}) => {
  const { isAdmin } = useAuth();

  const { asPath } = useRouter();

  console.log(asPath);
  return (
    <div className="w-full border shadow-md rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0 md:w-52">
          <div className="h-full w-full">
            <Image
              alt="trustImage"
              src={trustImage}
              width={160}
              height={160}
              objectFit="cover"
              objectPosition="center"
              className="h-full w-full"
            />
          </div>
        </div>
        <div className="flex flex-col flex-grow p-4">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center mr-4 mb-2">
              <span className="mr-2 text-gray-700">Collection:</span>
              <span className="text-gray-900 font-semibold">
                ₹{formatAmount(amount)}
              </span>
            </div>
            {asPath !== "/admin/transactions" ? (
              <div className="flex items-center mr-4 mb-2">
                <span className="mr-2 text-gray-700">Fund Requirement:</span>
                <span className="text-gray-900 font-semibold">
                  ₹{formatAmount(fundRequirement)}
                </span>
              </div>
            ) : (
              ""
            )}

            <div className="flex items-center mb-2">
              <span className="mr-2 text-gray-700">Founder:</span>
              <span className="text-gray-900 font-semibold">{founder}</span>
            </div>
            {statusOfModel ? (
              <div className="flex items-center mb-2">
                <span className="mr-2 text-gray-700">Status:</span>
                <span
                  className={`${
                    statusOfModel
                      ?.charAt(0)
                      .toUpperCase()
                      .concat(statusOfModel?.slice(1)) === "Pending"
                      ? "text-red-500"
                      : "text-green-500"
                  } font-semibold`}
                >
                  {statusOfModel
                    ?.charAt(0)
                    .toUpperCase()
                    .concat(statusOfModel?.slice(1))}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            <div className="flex flex-col">
              <button
                onClick={onShowTransaction}
                className="py-2 px-4 bg-primary text-white rounded-md shadow-sm"
              >
                Show Transaction
              </button>
              {!isAdmin && (
                <button
                  onClick={onEditDisaster}
                  className="mt-2 py-2 px-4 bg-green-600 text-white rounded-md shadow-sm"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTrustsModel;
