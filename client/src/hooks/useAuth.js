import { useState, useEffect, useCallback } from "react";
import { auth } from "../services/api";

/**
 * useAuth hook - manages authentication state and operations
 * Handles login, register, anonymous sessions, and token persistence
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("yaar_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { user } = await auth.me();
        setUser(user);
      } catch (err) {
        // Token expired or invalid
        localStorage.removeItem("yaar_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await auth.login(email, password);
      localStorage.setItem("yaar_token", token);
      setUser(user);
      return { token, user };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await auth.register(email, password);
      localStorage.setItem("yaar_token", token);
      setUser(user);
      return { token, user };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAnonymous = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await auth.anonymous();
      localStorage.setItem("yaar_token", token);
      setUser(user);
      return { token, user };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("yaar_token");
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    loginAnonymous,
    logout,
  };
}

export default useAuth;
