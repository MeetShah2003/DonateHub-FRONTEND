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
  const [openMobileMenu, setOpenMobileMenu] = useState<number | null>(null);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<number | null>(null);
  const { logout } = useAuth();
  return (
    <div className="overflow-x-hidden bg-slate-50">
      <nav className="fixed top-0 z-10 w-full border-b border-slate-200 bg-white/90 py-2 backdrop-blur">
        <div className="mx-auto flex w-[90%] max-w-full items-center justify-between">
          <div
            onClick={() => {
              setIsHamburgerOpen(!isHamburgerOpen);
            }}
            className="md:hidden"
          >
            {isHamburgerOpen ? <CloseHamburgerIcon /> : <HamburgerIcon />}
          </div>
          <div className="text-3xl font-bold text-primary">
            <Logo />
          </div>
          <div>
            <ul className="hidden gap-7 md:flex">
              {NAV_MENUES &&
                NAV_MENUES.length &&
                NAV_MENUES.map(({ id, menu, path }, index) => {
                  return (
                    <li
                      key={index}
                      className="relative text-base font-semibold text-slate-700 transition hover:text-primary"
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

      <div className="flex w-full md:hidden">
        <div
          className={`fixed ${
            isHamburgerOpen
              ? "left-0 transition-all duration-300 ease-in-out"
              : "-left-[2000px] transition-all duration-300 ease-in-out md:left-0"
          } top-[70px] z-20 h-screen w-2/4 overflow-y-auto rounded-sm border border-t-transparent bg-white shadow-xl`}
        >
          <ul className="space-y-1 p-3">
            {SIDE_BAR_MENUES &&
              SIDE_BAR_MENUES.length &&
              SIDE_BAR_MENUES.map(
                ({ id, menu, path, icon, dropdownOptions }, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        if (dropdownOptions) {
                          setOpenMobileMenu((current) =>
                            current === id ? null : id
                          );
                        }
                      }}
                      className="relative flex flex-col justify-center rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div>{icon}</div>
                        <Link href={path}>{menu}</Link>
                      </div>
                      <ul
                        className={`${
                          openMobileMenu === id ? "mt-2 flex flex-col" : "hidden"
                        }`}
                      >
                        {dropdownOptions &&
                          dropdownOptions.length &&
                          dropdownOptions.map(
                            ({ icon, path, menuTitle }, index) => {
                              return (
                                <li
                                  key={index}
                                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600"
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
              className="relative flex cursor-pointer flex-col justify-center rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700"
            >
              <div className="flex items-center gap-3">
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

        <div className="w-full p-5">
          <p className="pb-5 font-inter text-xl font-semibold text-steelGray sm:text-2xl">
            {title}
          </p>
          {children}
        </div>
      </div>

      <div className="hidden md:flex md:w-full">
        <div className="w-1/4">
          <div className="fixed top-[70px] h-screen w-1/4 rounded-r-[28px] border-r border-slate-200 bg-gradient-to-b from-slate-900 to-slate-800 p-3 lg:w-1/4">
            <div className="rounded-[22px] bg-white/10 px-4 py-3 text-sm font-semibold text-white/90">
              Trust Panel
            </div>
            <ul className="mt-3 space-y-1">
              {SIDE_BAR_MENUES &&
                SIDE_BAR_MENUES.length &&
                SIDE_BAR_MENUES.map(
                  ({ id, menu, path, icon, dropdownOptions }, index) => {
                    return (
                      <li
                        key={index}
                        onClick={() => {
                          if (dropdownOptions) {
                            setOpenDesktopMenu((current) =>
                              current === id ? null : id
                            );
                          }
                        }}
                        className="relative flex flex-col justify-center rounded-2xl px-3 py-3 text-sm font-semibold text-white/90"
                      >
                        <div className="flex items-center gap-3">
                          <div>{icon}</div>
                          <Link href={path}>{menu}</Link>
                        </div>
                        <ul
                          className={`${
                            openDesktopMenu === id ? "mt-2 flex flex-col" : "hidden"
                          }`}
                        >
                          {dropdownOptions &&
                            dropdownOptions.length &&
                            dropdownOptions.map(
                              ({ icon, path, menuTitle }, index) => {
                                return (
                                  <li
                                    key={index}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200"
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
                className="relative flex cursor-pointer flex-col justify-center rounded-2xl px-3 py-3 text-sm font-semibold text-white/90"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <LogoutIcon color="#FFFFFF" />
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
        <div className="mt-16 w-3/4 p-5">
          <p className="pb-5 font-inter text-xl font-semibold text-steelGray sm:text-2xl">
            {title}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default TrustNavbar;
