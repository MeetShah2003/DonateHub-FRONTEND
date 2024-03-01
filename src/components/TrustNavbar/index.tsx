import { useAuth } from "@/context/auth";
import AboutUsIcon from "@/icons/AboutUsIcon";
import CloseHamburgerIcon from "@/icons/CloseHamburgerIcon";
import ContactUsIcon from "@/icons/ContactUsIcon";
import HamburgerIcon from "@/icons/HamburgurIcon";
import HomeIcon from "@/icons/HomeIcon";
import Logo from "@/icons/Logo";
import ProfileIcon from "@/icons/ProfileIcon";
import { useRouter } from "next/router";
import React, { Children, ReactNode, useState } from "react";
import Link from "next/link";
import LogoutIcon from "@/icons/LogoutIcon";
import TrustProfile from "../TrustProfile";
import RequestFundIcon from "@/icons/RequestFundIcon";
import DropDownArrow from "@/icons/DropDownArrow";

const TrustNavbar = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const SIDE_BAR_MENUES: {
    id: number;
    menu: string;
    path: string;
    icon: ReactNode;
    dropdownOptions?: { icon: ReactNode; title: string; path: string }[];
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
      icon: <ProfileIcon color="#000000" />,
      dropdownOptions: [
        {
          icon: <RequestFundIcon />,
          title: "Fund Requests",
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
  const NAV_MENUES: {
    id: number;
    menu: string;
    path: string;
    icon: ReactNode;
    dropdownOptions?: { icon: ReactNode; title: string; path: string }[];
  }[] = [
    {
      id: 1,
      menu: "Home",
      path: "/trust",
      icon: <HomeIcon />,
    },
    {
      id: 2,
      menu: "Contact Us",
      path: "/contactus",
      icon: <ContactUsIcon />,
    },
    {
      id: 3,
      menu: "About Us",
      path: "/aboutus",
      icon: <AboutUsIcon />,
    },
  ];

  const [isHovered, setIsHovered] = useState(false);
  const [isMenuTouched, setIsMenuTouched] = useState(false);

  return (
    <div>
      <div className="bg-white h-[78px] border shadow-sm">
        <nav className="max-w-full w-90% my-2 mx-auto flex items-center justify-between">
          <div
            onClick={() => {
              setIsHamburgerOpen(!isHamburgerOpen);
            }}
            className="sm:hidden"
          >
            {isHamburgerOpen ? <CloseHamburgerIcon /> : <HamburgerIcon />}
          </div>

          <div className="font-bold text-3xl text-primary">
            <Logo />
          </div>

          <div className="hidden sm:flex">
            <ul className="gap-5 lg:gap-7 sm:flex">
              {NAV_MENUES.map(({ id, menu, path, dropdownOptions }) => {
                if (menu === "Products" && !isAuthenticated) {
                  return null;
                }
                return (
                  <div className="flex items-center justify-center" key={id}>
                    <li
                      className="text-base text-gray-700 font-semibold relative"
                      onMouseEnter={() => {
                        if (menu === "Products") {
                          setIsHovered(true);
                        }
                      }}
                    >
                      <Link href={path}>{menu}</Link>
                      {dropdownOptions && isHovered && (
                        <ul className="absolute left-0 mt-2 w-[200px] bg-white shadow-lg border rounded-md py-1">
                          {dropdownOptions.map((option, index) => (
                            <div
                              className="flex items-center border-b cursor-pointer hover:bg-gray-100 px-3"
                              key={index}
                            >
                              <div>{option.icon}</div>
                              <li
                                onClick={() => {
                                  if (menu === "Products") {
                                    setIsHovered(false);
                                  }
                                }}
                                className="px-4 py-2"
                              >
                                <Link href={option.path}>{option.title}</Link>
                              </li>
                            </div>
                          ))}
                        </ul>
                      )}
                    </li>
                    {menu === "Products" && (
                      <div className="mt-1">
                        <DropDownArrow />
                      </div>
                    )}
                  </div>
                );
              })}
            </ul>
          </div>

          {!isAuthenticated ? (
            <div className="hidden sm:flex gap-5">
              <button
                onClick={() => {
                  setTimeout(() => {
                    router.push("/login");
                  }, 1000);
                }}
                className="rounded-md text-black border-2 py-2 px-5 font-semibold"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setTimeout(() => {
                    router.push("/signup");
                  }, 1000);
                }}
                className="bg-primary rounded-md text-white py-2 px-5 font-semibold"
              >
                Sign up
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex gap-5">
              <TrustProfile />
            </div>
          )}
        </nav>
      </div>

      {/* Sidebar for screens larger than md */}
      <div className="hidden border-r h-screen md:block bg-white text-white w-64">
        <ul>
          {SIDE_BAR_MENUES.map(({ id, menu, path, icon, dropdownOptions }) => (
            <li
              key={id}
              className="p-4  border cursor-pointer"
              onClick={() => {
                setIsMenuTouched(!isMenuTouched);
              }}
            >
              <Link href={path}>
                <div className="flex items-center">
                  <div className="mr-2">{icon}</div>
                  <span className="text-[#374151]">{menu}</span>
                </div>
              </Link>
              {dropdownOptions && (
                <ul className={`${isMenuTouched ? "flex" : "hidden"} pl-4`}>
                  {dropdownOptions.map(({ icon, path, title }, index) => (
                    <li key={index} className=" p-2">
                      <Link href={path}>
                        <div className="flex items-center">
                          <div className="mr-2">{icon}</div>
                          <span className="text-[#374151]">{title}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="p-4 cursor-pointer" onClick={logout}>
            <div className="flex items-center">
              <div className="mr-2">
                <LogoutIcon color="#FFFFFF" />
              </div>
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Hamburger menu for smaller screens */}
      <div className="relative z-50 w-full md:hidden">
        <div
          className={`absolute bg-white border ${
            isHamburgerOpen
              ? "transition-all ease-in-out duration-300 left-0"
              : "transition-all ease-in-out duration-300 -left-[2000px]"
          } rounded-sm h-screen w-3/4`}
        >
          <ul>
            {SIDE_BAR_MENUES.map(
              ({ id, menu, path, icon, dropdownOptions }) => (
                <li
                  onClick={() => {
                    if (menu === "Products") setIsMenuTouched(!isMenuTouched);
                  }}
                  key={id}
                  className="text-base px-5 border-b py-4 font-medium flex flex-col gap-3"
                >
                  <div className="flex gap-2">
                    <div>{icon}</div>
                    <Link href={path}>{menu}</Link>
                  </div>
                  {dropdownOptions && (
                    <ul
                      className={`${
                        isMenuTouched ? "flex" : "hidden"
                      }  flex-col justify-center gap-3 px-2`}
                    >
                      {dropdownOptions.map(({ icon, path, title }, index) => (
                        <li
                          key={index}
                          className="text-base px-5 font-medium flex gap-3"
                        >
                          <div>{icon}</div>
                          <Link href={path}>{title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            )}
            <li
              onClick={() => {
                logout();
              }}
              className="text-base px-5 py-4 font-medium flex gap-3"
            >
              <div>
                <LogoutIcon color="#000000" />
              </div>
              <p>Logout</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrustNavbar;
