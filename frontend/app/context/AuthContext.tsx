"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types";
import { getCurrentUser, isAuthenticated, logout } from "../services/auth";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  logout: () => void;
  updateAuthState: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  logout: () => {},
  updateAuthState: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const updateAuthState = () => {
    const isUserAuthenticated = isAuthenticated();
    setIsLoggedIn(isUserAuthenticated);

    if (isUserAuthenticated) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } else {
      setUser(null);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    updateAuthState();
    router.push("/");
  };

  useEffect(() => {
    updateAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        logout: handleLogout,
        updateAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
