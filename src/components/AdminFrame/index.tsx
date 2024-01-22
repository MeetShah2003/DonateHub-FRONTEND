import CameraIcon from "@/icons/CameraIcon";
import PlusIcon from "@/icons/PlusIcon";
import Image from "next/image";
import React, { ReactNode, useState } from "react";
import { useRouter } from "next/router";
import ManageTrustIcon from "@/icons/ManageTrustIcon";
import ManageUserIcon from "@/icons/ManageUserIcon";
import AnalyticsIcon from "@/icons/AnalyticsIcon";
import LogoutIcon from "@/icons/LogoutIcon";
import CloseIcon from "@/icons/CloseIcon";
import HamburgerIcon from "@/icons/HamburgurIcon";
import ProfileIcon from "@/icons/ProfileIcon";

const ADMIN_MENUS: {
  id: number;
  menu: string;
  path: string;
  icon: ReactNode;
}[] = [
  { id: 1, menu: "Add Trust", path: "/admin/addtrust", icon: <PlusIcon /> },
  {
    id: 2,
    menu: "Manage Trust",
    path: "/admin/managetrust",
    icon: <ManageTrustIcon />,
  },
  {
    id: 3,
    menu: "Manage User",
    path: "/admin/manageuser",
    icon: <ManageUserIcon />,
  },
  {
    id: 4,
    menu: "Analytics",
    path: "/admin/analytics",
    icon: <AnalyticsIcon />,
  },
  {
    id: 5,
    menu: "Profile",
    path: "/admin/profile",
    icon: <ProfileIcon />,
  },
  {
    id: 6,
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
    <div className="max-w-full w-full flex">
      <div className="hidden md:block md:w-[30%] lg:w-[20%] z-50 border shadow-sm rounded-lg h-full">
        <div className="flex flex-col border rounded-lg justify-center items-center py-5">
          <div className="rounded-full h-24 w-24 border-4 border-primary">
            <Image alt="" src={""} />
          </div>
          <div className="pt-2">
            <p className="text-steelGray font-bold">Admin</p>
          </div>
          <div>
            <p className="text-lightGray ">admin@gmail.com</p>
          </div>
        </div>
        <ul className="my-5">
          {ADMIN_MENUS &&
            ADMIN_MENUS.length > 0 &&
            ADMIN_MENUS.map(({ icon, id, menu, path }) => {
              return (
                <div
                  key={id}
                  className="flex items-center cursor-pointer gap-5 py-4 px-5"
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
              );
            })}
        </ul>
      </div>
      <div
        className={`w-[70%] absolute z-50 md:hidden border ${
          sideBarIsOpen
            ? "transition-all ease-in-out duration-500 -left-[2000px]"
            : "transition-all ease-in-out duration-500 left-0"
        }  shadow-sm rounded-lg h-screen`}
      >
        <div className="flex flex-col border bg-white  rounded-lg justify-center items-center py-5">
          <button
            onClick={() => {
              setSideBarIsOpen(true);
            }}
            className="flex justify-end w-full px-2"
          >
            <CloseIcon />
          </button>
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
        <ul className="">
          {ADMIN_MENUS &&
            ADMIN_MENUS.length > 0 &&
            ADMIN_MENUS.map(({ icon, id, menu, path }) => {
              return (
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
              );
            })}
        </ul>
      </div>
      <div className="w-[100%]  h-full p-5">
        <button
          className="md:hidden"
          onClick={() => {
            setSideBarIsOpen(false);
          }}
        >
          <div className="flex items-center gap-3">
            <HamburgerIcon />
            <p className=" font-inter font-semibold text-steelGray text-xl sm:text-2xl">
              {title}
            </p>
          </div>
        </button>
        <p className="hidden md:block p-5 font-inter font-semibold text-steelGray text-xl sm:text-2xl">
          {title}
        </p>
        {children}
      </div>
    </div>
  );
};

export default AdminFrame;
