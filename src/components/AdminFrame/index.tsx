import Image from "next/image";
import React, { ReactNode, useState } from "react";
import { useRouter } from "next/router";
import CloseIcon from "@/icons/CloseIcon";
import HamburgerIcon from "@/icons/HamburgurIcon";
import DashboardIcon from "@/icons/DashboardIcon";
import ApproveIcon from "@/icons/ApproveIcon";
import ManageTrustIcon from "@/icons/ManageTrustIcon";
import ManageUserIcon from "@/icons/ManageUserIcon";
import AnalyticsIcon from "@/icons/AnalyticsIcon";
import LogoutIcon from "@/icons/LogoutIcon";
import ProfileIcon from "@/icons/ProfileIcon";
import CloseHamburgerIcon from "@/icons/CloseHamburgerIcon";
import Logo from "@/icons/Logo";

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
    menu: "Analytics",
    path: "/admin/analytics",
    icon: <AnalyticsIcon />,
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

  return (
    <>
      <div className="border-b">
        <nav className="max-w-full w-90%  mx-auto flex items-center justify-between">
          <div
            onClick={() => {
              setSideBarIsOpen(!sideBarIsOpen);
            }}
            className="sm:hidden"
          >
            {!sideBarIsOpen ? <CloseHamburgerIcon /> : <HamburgerIcon />}
          </div>
          <div className="font-bold text-3xl text-primary">
            <Logo />
          </div>
        </nav>
      </div>
      <div className="flex">
        <nav className="h-5"></nav>
        {/* Sidebar for large screens */}
        <div className="hidden sm:block md:w-[30%] z-50 border border-t-transparent shadow-sm  overflow-y-auto sticky top-0 h-screen">
          {/* <div className="flex flex-col border rounded-lg justify-center items-center py-5">
            <div className="rounded-full h-24 w-24 border-4 border-primary">
              <Image alt="" src={""} />
            </div>
            <div className="pt-2">
              <p className="text-steelGray font-bold">Admin</p>
            </div>
            <div>
              <p className="text-lightGray ">admin@gmail.com</p>
            </div>
          </div> */}
          <ul className="my-5">
            {ADMIN_MENUS &&
              ADMIN_MENUS.length > 0 &&
              ADMIN_MENUS.map(({ icon, id, menu, path }) => (
                <div
                  key={id}
                  className="flex items-center cursor-pointer gap-5 py-4 px-5"
                  onClick={() => {
                    if (menu === "Logout") {
                      // handleLogout();
                    } else {
                      router.push(path);
                    }
                  }}
                >
                  <div className="h-5">{icon}</div>
                  <li>{menu}</li>
                </div>
              ))}
          </ul>
        </div>

        {/* Hamburger Sidebar for small screens */}
        <div
          className={`w-[70%] bg-white fixed z-50 sm:hidden border ${
            sideBarIsOpen
              ? "transition-all ease-in-out duration-500 -left-[2000px]"
              : "transition-all ease-in-out duration-500 left-0"
          } shadow-sm rounded-lg h-screen`}
        >
          <div className="flex flex-col border bg-white rounded-lg justify-center items-center py-5">
            {/* <button
              onClick={() => {
                setSideBarIsOpen(!sideBarIsOpen);
              }}
              className="flex justify-end w-full px-2"
            >
              <CloseIcon />
            </button> */}
            <div className="rounded-full h-24 w-24 border-4 border-primary">
              <Image alt="" src={""} />
            </div>
            <div className="pt-2">
              <p className="text-steelGray font-bold">Admin</p>
            </div>
            <div>
              <p className="text-lightGray">admin@gmail.com</p>
            </div>
          </div>
          <ul>
            {ADMIN_MENUS &&
              ADMIN_MENUS.length > 0 &&
              ADMIN_MENUS.map(({ icon, id, menu, path }) => (
                <div
                  key={id}
                  className="flex items-center bg-white cursor-pointer gap-5 py-4 px-5"
                >
                  <div className="h-5">{icon}</div>
                  <li
                    onClick={() => {
                      router.push(path);
                    }}
                  >
                    {menu}
                  </li>
                </div>
              ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full h-full p-5">
          <div className="flex sm:hidden  p-5 items-center gap-3">
            <p className="font-inter font-semibold text-steelGray text-xl sm:text-2xl">
              {title}
            </p>
          </div>

          {/* Main Content for small and large screens */}
          <p className="hidden sm:block p-5 font-inter font-semibold text-steelGray text-xl sm:text-2xl">
            {title}
          </p>
          <div className="px-5">{children}</div>
        </div>
      </div>
    </>
  );
};

export default AdminFrame;
