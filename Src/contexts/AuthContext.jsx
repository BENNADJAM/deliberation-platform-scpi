import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../Api/axios";

const AuthContext = createContext(null);

function readStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser = window.localStorage.getItem("auth-user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(readStoredUser);
  const [token, setTokenState] = useState(() => window.localStorage.getItem("token"));
  const [loading, setLoading] = useState(Boolean(window.localStorage.getItem("token")));

  const clearSession = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("auth-user");
    setUserState(null);
    setTokenState(null);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => {
        setUserState(data.user);
        window.localStorage.setItem("auth-user", JSON.stringify(data.user));
        setLoading(false);
      })
      .catch(() => {
        clearSession();
        setLoading(false);
      });
  }, [token]);

  const setUser = (value) => {
    if (!value) {
      clearSession();
      return;
    }

    setUserState(value);
    window.localStorage.setItem("auth-user", JSON.stringify(value));
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email: String(email || "").trim(),
      password: String(password || "").trim(),
    });
    setTokenState(data.token);
    window.localStorage.setItem("token", data.token);
    setUserState(data.user);
    window.localStorage.setItem("auth-user", JSON.stringify(data.user));
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore and clear local session anyway
    }

    clearSession();
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout,
      loading,
      isAuthenticated: Boolean(user),
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
