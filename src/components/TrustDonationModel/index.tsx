import React from "react";
import HeartIcon from "@/icons/HeartIcon";
import Image from "next/image";
import { TrustData } from "@/types/types";
import { useRouter } from "next/router";

interface TrustCardProps {
  trust: TrustData;
}

const TrustDonationModel: React.FC<TrustCardProps> = ({ trust }) => {
  const {
    trustName,
    trustlogo,
    founder,
    creationDate,
    category,
    contactNo,
    description,
    address,
    city,
    state,
    pincode,
    email,
    TotalAmount,
    _id,
  } = trust;

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  const { push } = useRouter();

  return (
    <div className="relative w-full">
      <div className="flex items-center w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* <div className="m-2 flex sm:flex-shrink-0">
          <Image
            alt="trustImage"
            className="rounded-md sm:h-24 w-full "
            src={trustlogo}
            width={100}
            height={100}
          ></Image>
        </div> */}
        <div className="flex flex-col md:flex-row w-full p-3 shadow-md borde rounded-lg gap-5 bg-white">
          <div className="w-full md:w-1/4 h-full rounded-lg">
            <Image
              src={trustlogo}
              width={500}
              height={300}
              className="h-full w-full rounded-lg"
              alt={"trustLogo"}
            />
          </div>
          <div className="flex flex-row gap-5 justify-between md:gap-48">
            <div className="w-3/4 flex flex-col gap-5 justify-between">
              <div>
                <h1 className="text-lg font-semibold">Trust Name</h1>
                <p className="text-xl text-gray-500">{trustName}</p>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Category</h1>
                <p className="text-xl text-gray-500">{category}</p>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Founder</h1>
                <p className="text-xl text-gray-500">{founder}</p>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Current Balance</h1>
                <p className="text-xl text-gray-500">
                  ₹{formatAmount(TotalAmount)}
                </p>
              </div>
            </div>
            <div className="w-3/4 flex flex-col gap-5">
              <div>
                <h1 className="text-lg font-semibold">Email</h1>
                <p className="text-xl text-gray-500">{email}</p>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Contact No</h1>
                <p className="text-xl text-gray-500">{contactNo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          push(`/dashboard/trustdonation/${_id}`);
        }}
        className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-md"
      >
        Donate
      </button>
    </div>
  );
};

export default TrustDonationModel;
