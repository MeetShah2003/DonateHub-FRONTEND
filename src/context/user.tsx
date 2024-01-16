import { Dispatch, SetStateAction, createContext } from "react";

type UserData = {
  email: string;
  password: string;
  username: string;
  role: "user" | "trust";
};

type AuthType = {
  accessToken?: string;
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
  getUserData: () => void;
  handleLogout: () => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const AuthContext = createContext({
    accessToken: '',
    userData: null,
    setUserData: () => {},
    getUserData: () => {},
    handleLogout: () => {},
    loading: true,
    setLoading: () => {},
  } as AuthType);