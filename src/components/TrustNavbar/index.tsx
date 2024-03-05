import Logo from "@/icons/Logo";
import Visitor from "../Visitor";
import TrustProfile from "../TrustProfile";
import Link from "next/link";
import HamburgerIcon from "@/icons/HamburgurIcon";
import React, { ReactNode, useState } from "react";
import CloseIcon from "@/icons/CloseIcon";
import CloseHamburgerIcon from "@/icons/CloseHamburgerIcon";
import HomeIcon from "@/icons/HomeIcon";
import ProfileIcon from "@/icons/ProfileIcon";
import RequestFundIcon from "@/icons/RequestFundIcon";
import ContactUsIcon from "@/icons/ContactUsIcon";
import AboutUsIcon from "@/icons/AboutUsIcon";
import ProductsIcon from "@/icons/ProductsIcon";

const NAV_MENUES: { id: number; menu: string; path: string }[] = [
  { id: 1, menu: "Home", path: "/trust" },
  { id: 2, menu: "Contact Us", path: "/" },
  { id: 3, menu: "About Us", path: "/" },
];

const SIDE_BAR_MENUES: {
  id: number;
  menu: string;
  path: string;
  icon: ReactNode;
  dropdownOptions?: { icon: ReactNode; menuTitle: string; path: string }[];
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
        icon: <RequestFundIcon />,
        menuTitle: "Fund Requests",
        path: "/trust/fundrequest",
      },
    ],
  },
  {
    id: 3,
    menu: "Contact Us",
    path: "/contactus",
    icon: <ContactUsIcon />,
  },
  {
    id: 4,
    menu: "About Us",
    path: "/aboutus",
    icon: <AboutUsIcon />,
  },
];

const TrustNavbar: React.FC<{ children: ReactNode; title: string }> = ({
  children,
  title,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isChildMenu, setIsChildMenu] = useState(false);
  return (
    <div>
      <nav className="border-b-2 py-1 shadow-sm sticky top-0 z-10 bg-white">
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
                NAV_MENUES.map(({ id, menu, path }) => {
                  return (
                    <li
                      key={id}
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
      <div className="relative flex w-full md:hidden">
        <div
          className={`absolute ${
            isHamburgerOpen
              ? "transition-all ease-in-out duration-300 left-0"
              : "transition-all ease-in-out duration-300 -left-[2000px] md:left-0"
          } bg-white border border-t-transparent rounded-sm w-2/4 h-screen`}
        >
          <ul>
            {SIDE_BAR_MENUES &&
              SIDE_BAR_MENUES.length &&
              SIDE_BAR_MENUES.map(
                ({ id, menu, path, icon, dropdownOptions }) => {
                  return (
                    <li
                      key={id}
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
                      <ul className={`${isChildMenu ? "flex" : "hidden"}`}>
                        {dropdownOptions &&
                          dropdownOptions.length &&
                          dropdownOptions.map(({ icon, path, menuTitle }) => {
                            return (
                              <li
                                key={id}
                                className="text-base flex items-center gap-3 py-3 px-5 text-gray-700 font-semibold relative"
                              >
                                <div>{icon}</div>
                                <Link href={path}>{menuTitle}</Link>
                              </li>
                            );
                          })}
                      </ul>
                    </li>
                  );
                }
              )}
          </ul>
        </div>
        <div className="w-full p-5">
          <p className="font-inter pb-5 font-semibold text-steelGray text-xl sm:text-2xl">
            {title}
          </p>
          {children}
        </div>
      </div>
      <div className="hidden md:flex md:w-full">
        <div className="w-1/4">
          <div
            className={`fixed bg-white border border-t-transparent rounded-sm h-screen w-1/4 lg:w-1/4`}
          >
            <ul>
              {SIDE_BAR_MENUES &&
                SIDE_BAR_MENUES.length &&
                SIDE_BAR_MENUES.map(
                  ({ id, menu, path, icon, dropdownOptions }) => {
                    return (
                      <li
                        key={id}
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
                        <ul className={`${isChildMenu ? "flex" : "hidden"}`}>
                          {dropdownOptions &&
                            dropdownOptions.length &&
                            dropdownOptions.map(({ icon, path, menuTitle }) => {
                              return (
                                <li
                                  key={id}
                                  className="text-base flex items-center gap-3 py-3 px-5 text-gray-700 font-semibold relative"
                                >
                                  <div>{icon}</div>
                                  <Link href={path}>{menuTitle}</Link>
                                </li>
                              );
                            })}
                        </ul>
                      </li>
                    );
                  }
                )}
            </ul>
          </div>
        </div>
        <div className="w-3/4 p-5">
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
