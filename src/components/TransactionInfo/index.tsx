import React from "react";

interface TransactionInfoProps {
  amount: string;
  userName: string;
  paymentId: string;
  userImage: string;
  transactionDate: string;
}

const TransactionInfo: React.FC<TransactionInfoProps> = ({
  amount,
  userName,
  paymentId,
  userImage,
  transactionDate,
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <img
            src={userImage}
            alt="User"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">{userName}</h2>
            <p className="text-gray-500 text-sm">{paymentId}</p>
          </div>
        </div>
        <div className="flex flex-col items-end text-right">
          <h2 className="text-lg font-semibold mb-2">Amount</h2>
          <p className="text-xl font-normal text-green-600">+ ₹ {amount}</p>
          <p className="text-sm text-gray-500">{transactionDate}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfo;
