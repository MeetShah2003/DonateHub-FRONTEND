import Logo from "@/icons/Logo";
import TrustProfile from "../TrustProfile";
import Link from "next/link";
import HamburgerIcon from "@/icons/HamburgurIcon";
import React, { ReactNode, useState } from "react";
import CloseHamburgerIcon from "@/icons/CloseHamburgerIcon";
import HomeIcon from "@/icons/HomeIcon";
import RequestFundIcon from "@/icons/RequestFundIcon";
import ContactUsIcon from "@/icons/ContactUsIcon";
import AboutUsIcon from "@/icons/AboutUsIcon";
import ProductsIcon from "@/icons/ProductsIcon";
import PlusIcon from "@/icons/PlusIcon";
import ProfileIcon from "@/icons/ProfileIcon";
import LogoutIcon from "@/icons/LogoutIcon";
import { useAuth } from "@/context/auth";
import TrustTransactionIcon from "@/icons/TrustTransactionIcon";
import DisasterIcon from "@/icons/DisasterIcon";
import ListIcon from "@/icons/ListIcon";
import ManageUserIcon from "@/icons/ManageUserIcon";
import ReviewIcon from "@/icons/ReviewIcon";

const NAV_MENUES: { id: number; menu: string; path: string }[] = [
  { id: 1, menu: "Home", path: "/trust" },
  { id: 2, menu: "Contact Us", path: "/trust/contactus" },
  { id: 3, menu: "About Us", path: "/trust/aboutus" },
  {
    id: 4,
    menu: "Profile",
    path: "/trust/profile",
  },
];

const SIDE_BAR_MENUES: {
  id: number;
  menu: string;
  path: string;
  icon: ReactNode;
  dropdownOptions?: {
    id: number;
    icon: ReactNode;
    menuTitle: string;
    path: string;
  }[];
}[] = [
  {
    id: 1,
    menu: "Home",
    path: "/trust",
    icon: <HomeIcon />,
  },
  {
    id: 2,
    menu: "Products",
    path: "/trust",
    icon: <ProductsIcon />,
    dropdownOptions: [
      {
        id: 1,
        icon: <RequestFundIcon color="#374151" />,
        menuTitle: "Fund Requests",
        path: "/trust/fundrequest",
      },
      {
        id: 2,
        icon: <PlusIcon />,
        menuTitle: "Add Disaster",
        path: "/trust/adddisaster",
      },
      {
        id: 3,
        icon: <DisasterIcon color="#374151" />,
        menuTitle: "Disasters",
        path: "/trust/disasters",
      },
      {
        id: 4,
        icon: <TrustTransactionIcon />,
        menuTitle: "Transactions",
        path: "/trust/transactions",
      },
      {
        id: 5,
        icon: <ListIcon color="#374151" />,
        menuTitle: "List Of FundRequest",
        path: "/trust/listoffundrequest",
      },
      {
        id: 6,
        icon: <ReviewIcon color="#374151" />,
        menuTitle: "Reviews",
        path: "/trust/reviews",
      },
    ],
  },
  {
    id: 3,
    menu: "Contact Us",
    path: "/trust/contactus",
    icon: <ContactUsIcon />,
  },
  {
    id: 4,
    menu: "About Us",
    path: "/trust/aboutus",
    icon: <AboutUsIcon />,
  },
  {
    id: 5,
    menu: "Profile",
    path: "/trust/profile",
    icon: <ProfileIcon color={"#000000"} />,
  },
];

const TrustNavbar: React.FC<{ children: ReactNode; title: string }> = ({
  children,
  title,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isChildMenu, setIsChildMenu] = useState(false);
  const { logout } = useAuth();
  return (
    <div>
      <nav className="border-b-2 py-1 shadow-sm fixed w-full top-0 z-10 bg-white">
        <div className="max-w-full w-90% mx-auto flex items-center justify-between">
          <div
            onClick={() => {
              setIsHamburgerOpen(!isHamburgerOpen);
            }}
            className="md:hidden"
          >
            {isHamburgerOpen ? <CloseHamburgerIcon /> : <HamburgerIcon />}
          </div>
          <div className="font-bold text-3xl text-primary">
            <Logo />
          </div>
          <div>
            <ul className="hidden md:flex gap-7">
              {NAV_MENUES &&
                NAV_MENUES.length &&
                NAV_MENUES.map(({ id, menu, path }, index) => {
                  return (
                    <li
                      key={index}
                      className="text-base text-gray-700 font-semibold relative"
                    >
                      <Link href={path}>{menu}</Link>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="hidden md:block">
            <TrustProfile />
          </div>
        </div>
      </nav>
      {/* Sidebar for mobile */}
      <div className=" flex  w-full md:hidden">
        {/* Hamburger menu */}
        <div
          className={`fixed ${
            isHamburgerOpen
              ? "transition-all ease-in-out duration-300 left-0"
              : "transition-all ease-in-out duration-300 -left-[2000px] md:left-0"
          } bg-white top-[70px] z-20 border border-t-transparent rounded-sm w-2/4 h-screen overflow-y-auto`}
        >
          <ul>
            {/* Sidebar menu items */}
            {SIDE_BAR_MENUES &&
              SIDE_BAR_MENUES.length &&
              SIDE_BAR_MENUES.map(
                ({ id, menu, path, icon, dropdownOptions }, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        if (dropdownOptions) {
                          setIsChildMenu(!isChildMenu);
                        }
                      }}
                      className="text-base flex flex-col justify-center border-b-2 py-3 px-5 text-gray-700 font-semibold relative"
                    >
                      <div className="flex gap-3">
                        <div>{icon}</div>
                        <Link href={path}>{menu}</Link>
                      </div>
                      {/* Dropdown options */}
                      <ul
                        className={`${
                          isChildMenu ? "flex" : "hidden"
                        } flex-col`}
                      >
                        {dropdownOptions &&
                          dropdownOptions.length &&
                          dropdownOptions.map(
                            ({ icon, path, menuTitle }, index) => {
                              return (
                                <li
                                  key={index}
                                  className="text-base flex items-center gap-3 py-3 px-5 text-gray-700 font-semibold relative"
                                >
                                  <div>{icon}</div>
                                  <Link href={path}>{menuTitle}</Link>
                                </li>
                              );
                            }
                          )}
                      </ul>
                    </li>
                  );
                }
              )}
            <li
              onClick={() => {}}
              className="text-base flex cursor-pointer flex-col justify-center border-b-2 py-3 px-5 text-gray-700 font-semibold relative"
            >
              <div className="flex gap-3">
                <div>
                  <LogoutIcon color="#000000" />
                </div>
                <p
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </p>
              </div>
            </li>
          </ul>
        </div>
        {/* Main content */}
        <div className="w-full p-5">
          <p className="font-inter pb-5 font-semibold text-steelGray text-xl sm:text-2xl">
            {title}
          </p>
          {children}
        </div>
      </div>
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-full">
        <div className="w-1/4">
          <div
            className={`fixed top-[70px] bg-white border-4 border-t-transparent rounded-sm h-screen w-1/4 lg:w-1/4`}
          >
            <ul>
              {/* Sidebar menu items */}
              {SIDE_BAR_MENUES &&
                SIDE_BAR_MENUES.length &&
                SIDE_BAR_MENUES.map(
                  ({ id, menu, path, icon, dropdownOptions }, index) => {
                    return (
                      <li
                        key={index}
                        onClick={() => {
                          if (dropdownOptions) {
                            setIsChildMenu(!isChildMenu);
                          }
                        }}
                        className="text-base flex flex-col justify-center border-b-4 py-3 px-5 text-gray-700 font-semibold relative"
                      >
                        <div className="flex gap-3">
                          <div>{icon}</div>
                          <Link href={path}>{menu}</Link>
                        </div>
                        {/* Dropdown options */}
                        <ul
                          className={`${
                            isChildMenu ? "flex flex-col" : "hidden"
                          }`}
                        >
                          {dropdownOptions &&
                            dropdownOptions.length &&
                            dropdownOptions.map(
                              ({ icon, path, menuTitle }, index) => {
                                return (
                                  <li
                                    key={index}
                                    className="text-base flex items-center gap-3 py-3 px-5 text-gray-700 font-semibold relative"
                                  >
                                    <div>{icon}</div>
                                    <Link href={path}>{menuTitle}</Link>
                                  </li>
                                );
                              }
                            )}
                        </ul>
                      </li>
                    );
                  }
                )}
              <li
                onClick={() => {}}
                className="text-base flex flex-col cursor-pointer justify-center border-b-4 py-3 px-5 text-gray-700 font-semibold relative"
              >
                <div className="flex gap-3">
                  <div>
                    <LogoutIcon color="#000000" />
                  </div>
                  <p
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-3/4 mt-16 p-5">
          <p className="font-inter pb-5  font-semibold text-steelGray text-xl sm:text-2xl">
            {title}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default TrustNavbar;
