import HeartIcon from "@/icons/HeartIcon";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";

interface TrustModelProps {
  trustId: string;
  title: string;
  donationRaised: number;
  donationTarget: number;
  supporters: number;
  trustlogo: string;
}
const TrustModel: React.FC<TrustModelProps> = ({
  donationRaised,
  donationTarget,
  supporters,
  title,
  trustId,
  trustlogo,
}) => {
  const progress = (donationRaised / donationTarget) * 100;

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const { push } = useRouter();
  return (
    <div className="w-full shadow-md rounded-lg border-2 flex flex-col justify-center">
      <div className="w-full h-48 relative">
        <Image
          alt="trustLogo"
          className="object-cover w-full h-full rounded-t-lg"
          src={trustlogo}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col justify-between gap-3 p-5">
        <h1 className="text-base font-bold text-[#444] ">{title}</h1>
        <p className="text-xl font-bold text-[#444]">
          ₹{formatNumber(donationRaised)}
          <span className="text-[#999] text-base font-normal">
            {" "}
            raised out of ₹{formatNumber(donationTarget)}
          </span>
        </p>
        <div className="w-full h-2 bg-primaryLight rounded-full">
          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-primary"
          ></div>
        </div>
        <div className="md:flex md:flex-col md:justify-between sm:items-center gap-1">
          <div className="flex justify-start gap-1 pb-3 sm:pb-0">
            <HeartIcon />
            <span className="text-[#444] font-bold">{supporters}</span>
            <span>Supporters</span>
          </div>
          <div className="flex flex-col md:w-full border-2 bg-primary shadow-sm rounded-lg px-2 py-2">
            <button
              type="submit"
              className="outline-none text-white font-inter font-medium"
              onClick={() => {
                push(`/dashboard/${trustId}`);
              }}
            >
              Donate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustModel;
