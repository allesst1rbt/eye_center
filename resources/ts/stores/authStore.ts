import { authLogin, LoginResponse } from "@/services/authService";
import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthStore = {
  user: User | null;
  token: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem("token"),

  login: async (data) => {
    try {
      const response: LoginResponse = await authLogin(data);
      localStorage.setItem("token", response.token);
      set({ token: response.token, user: response.user });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.clear();
    set({ token: null, user: null });
  },
}));
