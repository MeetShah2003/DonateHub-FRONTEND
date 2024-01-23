import React, { createContext, useContext, useState } from "react";

type UserData = {
  email: string;
  password: string;
  username: string;
  role: "user" | "trust";
};

type AuthType = {
  accessToken?: string;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  getUserData: () => void;
  handleLogout: () => void;
  forgotPasswordEmail: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setForgotPasswordEmail: React.Dispatch<React.SetStateAction<string>>;
};

const AuthContext = createContext<AuthType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");

  const getUserData = async () => {
    const allUserData = await fetch("http://localhost:8090/admin/allUsers");
    return allUserData;
  };

  const handleLogout = () => {
    // Implement logic to handle logout
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userData,
        setUserData,
        getUserData,
        handleLogout,
        setForgotPasswordEmail,
        loading,
        setLoading,
        forgotPasswordEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
};
