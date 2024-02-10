import HamburgerIcon from "@/icons/HamburgurIcon";
import Link from "next/link";
// import { useUser } from "@/context/user";
import { ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import HomeIcon from "@/icons/HomeIcon";
import ContactUsIcon from "@/icons/ContactUsIcon";
import AboutUsIcon from "@/icons/AboutUsIcon";
import LogoutIcon from "@/icons/LogoutIcon";
import ProfileIcon from "@/icons/ProfileIcon";
import HeaderBgImage from "@/../public/images/headerBgImage.png";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

import CloseHamburgerIcon from "@/icons/CloseHamburgerIcon";
import { useAuth } from "@/context/auth";
import Logo from "@/icons/Logo";
import Spinner from "../Spinner";
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
    path: "/profile",
    icon: <ProfileIcon />,
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
  // {
  //   id: 5,
  //   menu: "Logout",
  //   path: "/aboutus",
  //   icon: <LogoutIcon />,
  // },
];

const Visitor = () => {
  // const { isLogin } = useUser();
  // const [isLogin, setIsLogin] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  // useEffect(() => {
  //   const userDataToken = Cookies.get("user_data");
  //   if (userDataToken) {
  //     setIsLogin(true);
  //   } else {
  //     setIsLogin(false);
  //   }
  // }, []);

  // console.log(isLogin);

  return (
    <div>
      {/* <Spinner /> */}
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
                  router.push("/login");
                }}
                className="rounded-md text-black border-2 py-2 px-5 font-semibold"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  router.push("/signup");
                }}
                className="bg-primary rounded-md text-white py-2 px-5 font-semibold"
              >
                Sign up
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex gap-5">
              <button
                onClick={() => {
                  logout();
                }}
                className="rounded-md text-black border-2 py-2 px-5 font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>

      <div className="relative w-full sm:hidden">
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
                // console.log(isAuthenticated);
              }}
              className="text-base px-5 py-4 font-medium flex gap-3"
            >
              <div>
                <LogoutIcon />
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

export default Visitor;
