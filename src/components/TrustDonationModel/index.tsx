import React from "react";
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
    category,
    contactNo,
    email,
    manualDonation,
    _id,
  } = trust;

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  const { push } = useRouter();

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_22px_65px_-30px_rgba(15,23,42,0.3)]">
      <div className="flex flex-col gap-5 p-4 md:flex-row md:p-5">
        <div className="relative h-52 overflow-hidden rounded-2xl md:w-[260px]">
          <Image
            alt="trustImage"
            src={trustlogo}
            width={500}
            height={500}
            objectFit="cover"
            className="h-full w-full"
          />
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Trust Name
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{trustName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Category
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{category}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Founder
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{founder}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Current Balance
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                ₹{formatAmount(manualDonation)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Contact
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">{email}</p>
              <p className="mt-1 text-base text-slate-700">{contactNo}</p>
            </div>
          </div>

          <div className="flex items-end justify-end">
            <button
              onClick={() => {
                push(`/dashboard/trustdonation/${_id}`);
              }}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              Donate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustDonationModel;
