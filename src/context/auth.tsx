// AuthProvider.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "@/consts";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const errorToast = (errorMessage: string) => toast.error(errorMessage);
const successToast = (successMessage: string) => toast.success(successMessage);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: any;
    token: string | null;
  }>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    const storedToken = Cookies.get("access_token");
    if (storedToken) {
      setAuthState({
        isAuthenticated: true,
        user: null,
        token: storedToken,
      });
    }
  }, [Cookies.get("access_token")]);

  const apiLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Something Went Wrong");
      }

      const { user, token, message } = await response.json();
      return { user, token, message };
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user, token, message } = await apiLogin(email, password);

      if (message === "login sucessfull") {
        setAuthState({
          isAuthenticated: true,
          user,
          token,
        });
        Cookies.set("access_token", token, { expires: 7 });

        // successToast(`Welcome back, ${user.username}!`);
      } else {
        if (message === "user not found") {
          errorToast("Email not found");
        } else if (message === "invalid password") {
          errorToast("Invalid password");
        } else {
          errorToast("Login failed");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      errorToast("Login failed");
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    Cookies.remove("access_token");
  };

  const authContextValue: AuthContextType = {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    token: authState.token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
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
