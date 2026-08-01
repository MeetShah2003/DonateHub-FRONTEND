import HeartIcon from "@/icons/HeartIcon";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";

interface TrustModelProps {
  trustId: string;
  title: string;
  donationRaised?: number;
  donationTarget?: number;
  supporters: number;
  trustlogo: string;
  description?: string;
  type: "fundrequest" | "trust";
}
const TrustModel: React.FC<TrustModelProps> = ({
  donationRaised,
  donationTarget,
  supporters,
  title,
  trustId,
  trustlogo,
  type,
  description,
}) => {
  const progress =
    donationRaised && donationTarget
      ? (donationRaised / donationTarget) * 100
      : 0;

  const formatNumber = (num?: number) => {
    if (num === undefined) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const { push } = useRouter();
  return (
    <div className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-25px_rgba(79,70,229,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-25px_rgba(79,70,229,0.45)]">
      <div className="relative h-56 overflow-hidden">
        <Image
          alt="trustLogo"
          className="object-cover transition duration-500 group-hover:scale-105"
          src={trustlogo}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            {type === "fundrequest" ? "Campaign" : "Trust"}
          </span>
        </div>

        {type === "fundrequest" ? (
          <>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-sm text-slate-500">Raised so far</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                ₹{formatNumber(donationRaised)}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Goal: ₹{formatNumber(donationTarget)}
              </p>
            </div>
            <div className="w-full h-2.5 overflow-hidden rounded-full bg-primaryLight">
              <div
                style={{ width: `${Math.min(progress, 100)}%` }}
                className="h-full rounded-full bg-primary"
              ></div>
            </div>
          </>
        ) : (
          <p className="text-sm leading-6 text-slate-600">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50">
              <HeartIcon />
            </span>
            <span className="font-semibold text-slate-900">{supporters}</span>
            <span>Supporters</span>
          </div>
          <button
            type="button"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            onClick={() => {
              if (type === "trust") {
                push(`/dashboard/trustdonation/${trustId}`);
              } else {
                push(`/dashboard/${trustId}`);
              }
            }}
          >
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrustModel;
