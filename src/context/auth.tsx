import { BACKEND_BASE_URL } from "@/consts";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  useState,
  useContext,
  useEffect,
  createContext,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isAdmin: boolean;
  logout: () => void;
  forgotPasswordEmail: string | null;
  setForgotPasswordEmail: Dispatch<SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const access_token = Cookies.get("access_token");
  const router = useRouter();
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: any;
    isAdmin: boolean;
  }>({
    isAuthenticated: false,
    user: null,
    isAdmin: false,
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
            isAdmin: data.userAuth.role === "admin",
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("role");
    setAuthState({
      isAuthenticated: false,
      user: null,
      isAdmin: false,
    });
  };

  useEffect(() => {
    // Check if access_token exists before calling authMe
    if (access_token) {
      authMe();
    }
  }, [access_token,]);

  // Ensure authState is initialized before rendering children
  const initialized = access_token ? authState.isAuthenticated : true;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        isAdmin: authState.isAdmin,
        logout: logout,
        forgotPasswordEmail,
        setForgotPasswordEmail,
      }}
    >
      {initialized ? children : null}
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
