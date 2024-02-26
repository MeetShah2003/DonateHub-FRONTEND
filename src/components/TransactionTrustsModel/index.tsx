import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

interface TransactionTrustsModelProps {
  trustImage: string;
  title: string;
  description: string;
  founder: string;
  creationDate: string;
  amount: string;
  onShowTransaction: () => void;
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
  onShowTransaction,
}) => {
  const router = useRouter();
  return (
    <div className="w-full border shadow-md rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0 md:w-40">
          <div className="h-full">
            <Image
              alt="trustImage"
              src={trustImage}
              width={160}
              height={160}
              objectFit="cover"
              objectPosition="center"
            />
          </div>
        </div>
        <div className="flex flex-col flex-grow p-4">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center mr-4 mb-2">
              <span className="mr-2 text-gray-700">Collection:</span>
              <span className="text-gray-900 font-semibold">₹{amount}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="mr-2 text-gray-700">Founder:</span>
              <span className="text-gray-900 font-semibold">{founder}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-center md:justify-start">
            <button
              onClick={onShowTransaction}
              className="py-2 px-4 bg-primary text-white rounded-md shadow-sm"
            >
              Show Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTrustsModel;
