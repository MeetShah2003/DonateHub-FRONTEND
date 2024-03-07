import { RequestFunds } from "@/types/types";
import React from "react";
import { useRouter } from "next/router";

const FundRequestsModel: React.FC<{ data: RequestFunds }> = ({ data }) => {
  const { push } = useRouter();
  const { title, description, _id } = data;

  return (
    <div className="flex w-full flex-col md:flex-row gap-3 bg-white border shadow-md rounded-lg p-6 mb-4">
      <div className="w-full md:w-3/4">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p
          className="text-gray-600 mb-4 overflow-hidden"
          style={{ maxHeight: "3rem" }}
        >
          {description}
        </p>
      </div>

      <div className="flex w-full md:w-1/4 md:flex-row items-center justify-end">
        <div className="w-full">
          <button
            onClick={() => {
              push(`/trust/fundrequest/${_id}`);
            }}
            className="bg-primary w-full text-white px-4 py-2 rounded-lg hover:bg-secondary"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundRequestsModel;
