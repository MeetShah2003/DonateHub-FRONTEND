// import React, { createContext, useContext, useState } from "react";
// import Cookies from "js-cookie";
// import { useRouter } from "next/router";

// type UserData = {
//   email: string;
//   password: string;
//   username: string;
//   role: "user" | "trust";
// };

// type AuthType = {
//   accessToken?: string;
//   userData: UserData | null;
//   setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
//   getUserData: () => void;
//   handleLogout: () => void;
//   forgotPasswordEmail: string;
//   loading: boolean;
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   setForgotPasswordEmail: React.Dispatch<React.SetStateAction<string>>;
//   setAccessToken: React.Dispatch<React.SetStateAction<string>>;
// };

// const AuthContext = createContext<AuthType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [accessToken, setAccessToken] = useState<string>("");
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
//   const access_token = Cookies.get("user_data");
//   const router = useRouter();
//   const getUserData = async () => {};

//   const handleLogout = () => {
//     if (access_token) {
//       Cookies.remove("user_data");
//       router.push("/login");
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         accessToken,
//         userData,
//         setUserData,
//         setAccessToken,
//         getUserData,
//         handleLogout,
//         setForgotPasswordEmail,
//         loading,
//         setLoading,
//         forgotPasswordEmail,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useUser must be used within an AuthProvider");
//   }
//   return context;
// };
