import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  locale?: string;
  avatarImage?: string;
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokenState, setTokenState] = useState<string | null>(null);
  const [userState, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        if (storedToken) setTokenState(storedToken);
        if (storedUser) setUserState(JSON.parse(storedUser));
      } catch (e) {
        console.log("Failed to load auth data", e);
      }
    };
    loadAuth();
  }, []);

  const setToken = (tok: string | null) => {
    setTokenState(tok);
    if (tok) {
      AsyncStorage.setItem("token", tok).catch((e) =>
        console.log("Failed to persist token", e)
      );
    } else {
      AsyncStorage.removeItem("token").catch((e) =>
        console.log("Failed to remove token", e)
      );
    }
  };

  const setUser = (usr: User | null) => {
    setUserState(usr);
    if (usr) {
      AsyncStorage.setItem("user", JSON.stringify(usr)).catch((e) =>
        console.log("Failed to persist user", e)
      );
    } else {
      AsyncStorage.removeItem("user").catch((e) =>
        console.log("Failed to remove user", e)
      );
    }
  };

  return (
    <AuthContext.Provider value={{ token: tokenState, setToken, user: userState, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
