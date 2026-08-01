import React, { ReactNode, useState } from "react";
import { useRouter } from "next/router";
import HamburgerIcon from "@/icons/HamburgurIcon";
import DashboardIcon from "@/icons/DashboardIcon";
import ApproveIcon from "@/icons/ApproveIcon";
import ManageTrustIcon from "@/icons/ManageTrustIcon";
import ManageUserIcon from "@/icons/ManageUserIcon";
import LogoutIcon from "@/icons/LogoutIcon";
import CloseHamburgerIcon from "@/icons/CloseHamburgerIcon";
import Logo from "@/icons/Logo";
import { useAuth } from "@/context/auth";
import TransactionIcon from "@/icons/TransactionIcon";
import UserProfile from "../UserProfile";
import CustomerQueryIcon from "@/icons/CustomerQueryIcon";
import DisaterTransactionIcon from "@/icons/DisasterTransactionIcon";
import RequestFundIcon from "@/icons/RequestFundIcon";

const ADMIN_MENUS: {
  id: number;
  menu: string;
  path: string;
  icon: ReactNode;
}[] = [
  { id: 1, menu: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  {
    id: 2,
    menu: "Verify Trust",
    path: "/admin/verifytrust",
    icon: <ApproveIcon />,
  },
  {
    id: 3,
    menu: "Manage Trust",
    path: "/admin/managetrust",
    icon: <ManageTrustIcon />,
  },
  {
    id: 4,
    menu: "Manage User",
    path: "/admin/manageuser",
    icon: <ManageUserIcon color="#FFFFFF" />,
  },
  {
    id: 5,
    menu: "Transactions",
    path: "/admin/transactions",
    icon: <TransactionIcon />,
  },
  {
    id: 6,
    menu: "Disaster Transactions",
    path: "/admin/managetransaction",
    icon: <DisaterTransactionIcon color="#FFFFFF" />,
  },
  {
    id: 7,
    menu: "Ask For Funds",
    path: "/admin/askforfunds",
    icon: <RequestFundIcon color="#FFFFFF" />,
  },
  {
    id: 8,
    menu: "Customer Query",
    path: "/admin/customerquery",
    icon: <CustomerQueryIcon />,
  },
  {
    id: 9,
    menu: "Logout",
    path: "/login",
    icon: <LogoutIcon color="#FFFFFF" />,
  },
];

const AdminFrame: React.FC<{
  title: string;
  children: ReactNode;
}> = ({ title, children }) => {
  const router = useRouter();
  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <>
      <div className="z-50 flex h-screen overflow-hidden bg-slate-50">
        <div className="z-50 hidden overflow-y-auto border-r border-slate-200 bg-gradient-to-b from-primary to-violet-800 shadow-[0_18px_60px_-35px_rgba(109,40,217,0.95)] sm:block sm:w-1/2 md:w-[28%]">
          <div className="px-5 pt-5">
            <div className="rounded-[24px] bg-white/10 px-4 py-3 text-sm font-semibold text-white/90 backdrop-blur-sm">
              Admin Panel
            </div>
          </div>
          <ul className="my-5 space-y-2 px-3">
            {ADMIN_MENUS.map(({ icon, id, menu, path }) => (
              <div
                key={id}
                className="flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-white transition hover:bg-white/10"
                onClick={() => {
                  if (menu === "Logout") {
                    logout();
                  } else {
                    router.push(path);
                  }
                }}
              >
                <div className="h-5">{icon}</div>
                <li className="text-sm font-semibold tracking-wide">{menu}</li>
              </div>
            ))}
          </ul>
        </div>

        <div
          className={`absolute top-[60px] z-20 h-screen w-2/3 border border-t-transparent bg-gradient-to-b from-primary to-violet-800 shadow-[0_18px_60px_-35px_rgba(109,40,217,0.95)] sm:hidden ${
            sideBarIsOpen
              ? "-translate-x-0 transition-all duration-500 ease-in-out"
              : "-translate-x-[2000px] transition-all duration-1000 ease-in-out"
          } overflow-y-auto rounded-tr-md rounded-tb-md`}
        >
          <div className="px-4 pt-4">
            <div className="rounded-[20px] bg-white/10 px-4 py-3 text-sm font-semibold text-white/90">
              Admin Panel
            </div>
          </div>
          <ul className="my-5 space-y-2 px-3">
            {ADMIN_MENUS.map(({ icon, id, menu, path }) => (
              <div
                key={id}
                className="flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-white transition hover:bg-white/10"
                onClick={() => {
                  if (menu === "Logout") {
                    logout();
                  } else {
                    router.push(path);
                  }
                }}
              >
                <div className="h-5">{icon}</div>
                <li className="text-sm font-semibold tracking-wide">{menu}</li>
              </div>
            ))}
          </ul>
        </div>

        <div className="flex w-full flex-col">
          <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <nav className="mx-auto flex max-w-full items-center justify-between px-7">
              <div
                onClick={() => {
                  setSideBarIsOpen(!sideBarIsOpen);
                }}
                className="sm:hidden"
              >
                {sideBarIsOpen ? <CloseHamburgerIcon /> : <HamburgerIcon />}
              </div>
              <div className="text-3xl font-bold text-primary">
                <Logo />
              </div>
              <UserProfile />
            </nav>
          </div>

          <div className="flex-grow overflow-y-auto">
            <div className="px-5">
              <div className="flex items-center gap-3 py-5 sm:hidden">
                <p className="font-inter text-xl font-semibold text-steelGray sm:text-2xl">
                  {title}
                </p>
              </div>

              <p className="hidden py-5 font-inter text-xl font-semibold text-steelGray sm:block sm:text-2xl">
                {title}
              </p>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminFrame;
