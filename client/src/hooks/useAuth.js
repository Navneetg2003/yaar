import { useState, useEffect, createContext, useContext } from "react";
import { apiLogin, apiRegister, apiLoginAnonymous } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token     = localStorage.getItem("yaar_token");
    const savedUser = localStorage.getItem("yaar_user");
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
    setLoading(false);
  }, []);

  function saveSession(token, userData) {
    localStorage.setItem("yaar_token", token);
    localStorage.setItem("yaar_user", JSON.stringify(userData));
    setUser(userData);
  }

  async function login(email, password) {
    const data = await apiLogin(email, password);
    saveSession(data.token, data.user);
    return data;
  }

  async function register(email, password) {
    const data = await apiRegister(email, password);
    saveSession(data.token, data.user);
    return data;
  }

  async function loginAnonymous() {
    const data = await apiLoginAnonymous();
    saveSession(data.token, data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem("yaar_token");
    localStorage.removeItem("yaar_user");
    localStorage.removeItem("yaar_onboarded");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, loginAnonymous, logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}