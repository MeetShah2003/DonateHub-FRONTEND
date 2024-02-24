import { useAuth } from "@/context/auth";
import LogoutIcon from "@/icons/LogoutIcon";
import ProfileIcon from "@/icons/ProfileIcon";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  console.log(user.firstName);
  console.log(user.lastName);
  console.log(user.userlogo);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const ITEMS: { id: number; menu: string; icon: ReactNode }[] = [
    { id: 1, menu: "My Profile", icon: <ProfileIcon color="#374151" /> },
    { id: 2, menu: "Logout", icon: <LogoutIcon color="#374151" /> },
  ];

  return (
    <div
      className="relative inline-block text-left cursor-pointer"
      onClick={toggleDropdown}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
          id="user-menu"
          aria-label="User menu"
          aria-haspopup="true"
        >
          <img
            className="h-10 w-10 rounded-full"
            src={user.userlogo}
            alt="User avatar"
          />
        </button>
        <div className="flex flex-col">
          <h1 className="font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="font-normal text-sm text-gray-400">{user?.email}</p>
        </div>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <div className="py-1">
            {ITEMS &&
              ITEMS.length &&
              ITEMS.map(({ id, menu, icon }) => {
                return (
                  <div
                    key={id}
                    onClick={() => {
                      if (menu === "My Profile") {
                        if (user?.role === "admin") {
                          router.push("/admin/profile");
                        } else {
                          router.push("/dashboard/profileuser");
                        }
                      } else {
                        logout();
                      }
                    }}
                    className="flex items-center border-b cursor-pointer hover:bg-gray-100 gap-2 px-3"
                  >
                    <span>{icon}</span>
                    <p
                      className="block py-2 text-sm text-gray-700  hover:text-gray-900"
                      role="menuitem"
                    >
                      {menu}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
