import React, { ReactNode, useState } from "react";
import { useRouter } from "next/router";
import HamburgerIcon from "@/icons/HamburgurIcon";
import DashboardIcon from "@/icons/DashboardIcon";
import ApproveIcon from "@/icons/ApproveIcon";
import ManageTrustIcon from "@/icons/ManageTrustIcon";
import ManageUserIcon from "@/icons/ManageUserIcon";
import LogoutIcon from "@/icons/LogoutIcon";
import ProfileIcon from "@/icons/ProfileIcon";
import CloseHamburgerIcon from "@/icons/CloseHamburgerIcon";
import Logo from "@/icons/Logo";
import { useAuth } from "@/context/auth";
import TransactionIcon from "@/icons/TransactionIcon";

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
    icon: <ManageUserIcon />,
  },
  {
    id: 5,
    menu: "Manage Transaction",
    path: "/admin/managetransaction",
    icon: <TransactionIcon />,
  },
  {
    id: 6,
    menu: "Profile",
    path: "/admin/profile",
    icon: <ProfileIcon />,
  },
  {
    id: 7,
    menu: "Logout",
    path: "/login",
    icon: <LogoutIcon />,
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
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar for large screens */}
        <div className="hidden sm:block sm:w-1/2 md:w-[30%] z-50 border border-t-transparent shadow-sm bg-primary rounded-tr-md rounded-tb-md overflow-y-auto">
          <ul className="my-5">
            {ADMIN_MENUS.map(({ icon, id, menu, path }) => (
              <div
                key={id}
                className="flex items-center cursor-pointer gap-5 py-4 px-5"
                onClick={() => {
                  if (menu === "Logout") {
                    logout();
                  } else {
                    router.push(path);
                  }
                }}
              >
                <div className="h-5">{icon}</div>
                <li className="text-white">{menu}</li>
              </div>
            ))}
          </ul>
        </div>

        <div
          className={`sm:hidden w-2/3 absolute top-[60px] border border-t-transparent shadow-sm ${
            sideBarIsOpen
              ? "-translate-x-0 transition-all duration-500 ease-in-out"
              : "-translate-x-[2000px] transition-all duration-1000 ease-in-out"
          } bg-primary rounded-tr-md rounded-tb-md overflow-y-auto`}
        >
          <ul className="my-5">
            {ADMIN_MENUS.map(({ icon, id, menu, path }) => (
              <div
                key={id}
                className="flex items-center cursor-pointer gap-5 py-4 px-5"
                onClick={() => {
                  if (menu === "Logout") {
                    logout();
                  } else {
                    router.push(path);
                  }
                }}
              >
                <div className="h-5">{icon}</div>
                <li className="text-white">{menu}</li>
              </div>
            ))}
          </ul>
        </div>

        <div className="flex flex-col w-full">
          <div className="border-b-2 sticky top-0 bg-white z-50">
            <nav className="max-w-full mx-auto flex items-center justify-between">
              <div
                onClick={() => {
                  setSideBarIsOpen(!sideBarIsOpen);
                }}
                className="sm:hidden"
              >
                {sideBarIsOpen ? <CloseHamburgerIcon /> : <HamburgerIcon />}
              </div>
              <div className="font-bold text-3xl text-primary">
                <Logo />
              </div>
            </nav>
          </div>

          <div className="flex-grow overflow-y-auto">
            <div className="px-5">
              <div className="flex sm:hidden p-5 items-center gap-3">
                <p className="font-inter font-semibold text-steelGray text-xl sm:text-2xl">
                  {title}
                </p>
              </div>

              <p className="hidden sm:block p-5 font-inter font-semibold text-steelGray text-xl sm:text-2xl">
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
