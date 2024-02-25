import { useAuth } from "@/context/auth";
import AboutUsIcon from "@/icons/AboutUsIcon";
import CloseHamburgerIcon from "@/icons/CloseHamburgerIcon";
import ContactUsIcon from "@/icons/ContactUsIcon";
import HamburgerIcon from "@/icons/HamburgurIcon";
import HomeIcon from "@/icons/HomeIcon";
import Logo from "@/icons/Logo";
import ProfileIcon from "@/icons/ProfileIcon";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import UserProfile from "../UserProfile";
import Link from "next/link";
import LogoutIcon from "@/icons/LogoutIcon";

const TrustNavbar = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();

  const router = useRouter();

  const NAV_MENUES: {
    id: number;
    menu: string;
    path: string;
    icon: ReactNode;
  }[] = [
    {
      id: 1,
      menu: "Home",
      path: "/dashboard",
      icon: <HomeIcon />,
    },
    {
      id: 2,
      menu: "Profile",
      path: "/dashboard/profile",
      icon: <ProfileIcon color="#FFFFFF" />,
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
            <ul className="gap-5 lg:gap-7 sm:flex">
              {NAV_MENUES.map(({ id, menu, path }) => {
                if (menu === "Profile" && !isAuthenticated) {
                  return null;
                }
                return (
                  <li
                    key={id}
                    onClick={() => {
                      router.push(path);
                    }}
                    className="text-base font-semibold"
                  >
                    {menu}
                  </li>
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
            {NAV_MENUES.map(({ id, menu, path, icon }) => {
              if (menu === "Profile" && !isAuthenticated) {
                return null;
              }
              return (
                <li
                  key={id}
                  className="text-base px-5 py-4 font-medium flex gap-3"
                >
                  <div>{icon}</div>
                  <Link href={path}>{menu}</Link>
                </li>
              );
            })}

            <li
              onClick={() => {
                logout();
              }}
              className="text-base px-5 py-4 font-medium flex gap-3"
            >
              <div>
                <LogoutIcon color="" />
              </div>
              <p>Logout</p>
            </li>
          </ul>
        </div>
      </div>

      {/* <div className="h-screen">
    <Image src={HeaderBgImage} alt="headerImage" />
  </div> */}
    </div>
  );
};

export default TrustNavbar;
