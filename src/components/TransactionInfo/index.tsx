import React from "react";
import Image from "next/image";

interface TransactionInfoProps {
  amount: number;
  userName: string;
  paymentId: string;
  userImage: string;
  transactionDate: Date;
}

const formatAmount = (amount: any) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};

const TransactionInfo: React.FC<TransactionInfoProps> = ({
  amount,
  userName,
  paymentId,
  userImage,
  transactionDate,
}) => {
  return (
    <div className="w-full bg-white rounded-lg border shadow-md p-4">
      <div className="flex  md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Image
            src={userImage}
            alt="User"
            className="w-12 h-12 rounded-full object-cover"
            height={200}
            width={300}
          />
          <div>
            <h2 className="text-lg font-semibold">{userName}</h2>
            <p className="text-gray-500 text-sm">{paymentId}</p>
          </div>
        </div>
        <div className="flex flex-col items-end text-right">
          <h2 className="text-lg font-semibold mb-2">Amount</h2>
          <p className="text-xl font-normal text-green-600">
            + ₹ {formatAmount(amount)}
          </p>
          <p className="text-sm hidden md:block text-gray-500">
            {transactionDate.toString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfo;
