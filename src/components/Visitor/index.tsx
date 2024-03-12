import HamburgerIcon from "@/icons/HamburgurIcon";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { useRouter } from "next/router";
import HomeIcon from "@/icons/HomeIcon";
import ContactUsIcon from "@/icons/ContactUsIcon";
import AboutUsIcon from "@/icons/AboutUsIcon";
import LogoutIcon from "@/icons/LogoutIcon";
import ProfileIcon from "@/icons/ProfileIcon";
import CloseHamburgerIcon from "@/icons/CloseHamburgerIcon";
import { useAuth } from "@/context/auth";
import Logo from "@/icons/Logo";
import UserProfile from "../UserProfile";
import DropDownArrow from "@/icons/DropDownArrow";
import TrustDonationIcon from "@/icons/TrustDonationIcon";
import RequestFundIcon from "@/icons/RequestFundIcon";
import TrustTransactionIcon from "@/icons/TrustTransactionIcon";
import DisaterTransactionIcon from "@/icons/DisasterTransactionIcon";

const Visitor = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

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
      path: `${isAuthenticated ? "/dashboard" : "/"}`,
      icon: <HomeIcon />,
    },
    {
      id: 2,
      menu: "Products",
      path: "/dashboard/trustdonation",
      icon: <ProfileIcon color="#000000" />,
      dropdownOptions: [
        {
          icon: <TrustDonationIcon />,
          title: "Trust Donation",
          path: "/dashboard/trustdonation",
        },
        {
          icon: <RequestFundIcon />,
          title: "Request Funds",
          path: "/dashboard/requestfunds",
        },
        {
          icon: <DisaterTransactionIcon />,
          title: "Disater Transaction",
          path: "/dashboard/disatertransaction",
        },
        {
          icon: <TrustTransactionIcon />,
          title: "Trust Transaction",
          path: "/dashboard/trusttransaction",
        },
      ],
    },
    {
      id: 3,
      menu: "Contact Us",
      path: "/dashboard/contactus",
      icon: <ContactUsIcon />,
    },
    {
      id: 4,
      menu: "About Us",
      path: "/aboutus",
      icon: <AboutUsIcon />,
    },
  ];

  return (
    <div>
      <div className="bg-white border shadow-sm">
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
            <ul className="gap-5 h-full lg:gap-7 sm:flex">
              {NAV_MENUES.map(({ id, menu, path, dropdownOptions }, index) => {
                if (menu === "Products" && !isAuthenticated) {
                  return null;
                }
                return (
                  <div className="flex items-center justify-center">
                    <li
                      key={index}
                      className="text-base py-5 text-gray-700 font-semibold relative"
                      onMouseEnter={() => {
                        if (menu === "Products") {
                          setIsHovered(true);
                        }
                      }}
                      onMouseLeave={() => {
                        if (menu === "Products") {
                          setIsHovered(false);
                        }
                      }}
                    >
                      <Link href={path}>{menu}</Link>
                      {dropdownOptions && isHovered && (
                        <ul className="absolute left-0 mt-2 w-[250px] bg-white shadow-lg border rounded-md py-1">
                          {dropdownOptions.map((option, index) => (
                            <div
                              onClick={() => {
                                if (menu === "Products") {
                                  setIsHovered(false);
                                }
                              }}
                              className="flex items-center border-b cursor-pointer hover:bg-gray-100 px-3"
                            >
                              <div>{option.icon}</div>
                              <li key={index} className="px-4 py-2 ">
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
              <UserProfile />
            </div>
          )}
        </nav>
      </div>

      <div className="relative z-50 w-full sm:hidden">
        <div
          className={`absolute bg-white border ${
            isHamburgerOpen
              ? "transition-all ease-in-out duration-300 left-0"
              : "transition-all ease-in-out duration-300 -left-[2000px]"
          } rounded-sm h-screen w-1/2`}
        >
          <ul className="flex  flex-col justify-center">
            {NAV_MENUES.map(
              ({ id, menu, path, icon, dropdownOptions }, index) => {
                if (menu === "My Account" && !isAuthenticated) {
                  return null;
                }
                return (
                  <li key={index} className="text-base px-5 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      {icon}
                      <Link href={path}>{menu}</Link>
                    </div>
                    {dropdownOptions && (
                      <ul className="pl-8">
                        {dropdownOptions.map((option, index) => (
                          <li key={index} className="py-2">
                            <Link href={option.path}>{option.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }
            )}
            {isAuthenticated && (
              <li
                onClick={() => {
                  logout();
                }}
                className="text-base px-5 py-4 font-medium flex items-center gap-3"
              >
                <LogoutIcon color="#000000" />
                <p>Logout</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Visitor;
