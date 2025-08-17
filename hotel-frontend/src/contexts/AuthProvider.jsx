// src/contexts/AuthProvider.jsx
import React, { createContext, useState, useEffect } from "react";
import API from "../api/client";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (username, password) => {
    const { data } = await API.post("/person/login", { username, password });
    setToken(data.token);
    setUser(data.user);
  };

  const signup = async (details) => {
    const { data } = await API.post("/person/signup", details);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = { user, token, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
