import { Dispatch, SetStateAction, useState } from "react";
import BlockedTrustIcon from "@/icons/BlockedTrustIcon";
import PendingStatusIcon from "@/icons/PendingStatusIcon";

const TrustNotLoginPopup: React.FC<{
  reason: "blocked" | "pending";
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ reason, isOpen, setIsOpen }) => {
  // const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`fixed z-50 inset-0 bg-gray-100/30 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="absolute bg-white w-80 md:w-96 rounded-lg shadow-2xl p-8 animate-fade-in">
        <div className="flex justify-center px-2 py-1 focus-within:border-primary">
          {reason === "blocked" ? <BlockedTrustIcon /> : <PendingStatusIcon />}
        </div>
        <div className="flex flex-col justify-center items-center px-2 my-10 focus-within:border-primary">
          <h3 className="font-inter text-2xl drop-shadow-2xl tracking-wider font-bold mb-3">
            {reason === "blocked" ? "You're Blocked" : "Verification Pending"}
          </h3>
          <p className="text-center text-gray-400 mb-5">
            {reason === "blocked"
              ? "Your account has been blocked. Please contact support for assistance."
              : "Your account verification is currently pending."}
          </p>

          <div
            onClick={() => {
              setIsOpen(false);
            }}
            className="flex flex-col cursor-pointer justify-center items-center w-full border-2 mt-5 text-white bg-primary shadow-sm rounded-lg px-3 py-2"
          >
            OK
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustNotLoginPopup;
