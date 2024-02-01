import { BACKEND_BASE_URL } from "@/consts";
import Cookies from "js-cookie";
import {
  useState,
  useContext,
  useEffect,
  createContext,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const access_token = Cookies.get("access_token");
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: any;
  }>({
    isAuthenticated: false,
    user: null,
  });

  const authMe = () => {
    fetch(`${BACKEND_BASE_URL}/api/authMe`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data: any) => {
        if (data) {
          setAuthState({
            isAuthenticated: true,
            user: data.userAuth,
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const logout = () => {
    Cookies.remove("access_token");
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  useEffect(() => {
    authMe();
  }, [access_token]);

  const authMeDataValue: AuthContextType = {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    logout: logout,
  };

  return (
    <AuthContext.Provider value={authMeDataValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
