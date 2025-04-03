import { authLogin, LoginResponse } from "@/services/authService";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const checkToken = useCallback(() => {
    if (token) {
      return localStorage.setItem("token", token);
    }

    localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  const login = async (data: { email: string; password: string }) => {
    try {
      const response: LoginResponse = await authLogin(data);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
