import { create } from "zustand";
import Cookies from "js-cookie";
import { api } from "@/lib/axios";

type Role = "CUSTOMER" | "MECHANIC";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: Role
  ) => Promise<void>;

  logout: () => void;
  loadUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get("token") || null,
  isLoading: false,

  // ---------------- LOGIN ----------------
  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { access_token, user } = res.data;

      // store in cookie (middleware can read this)
      Cookies.set("token", access_token, {
        expires: 7,
      });

      set({
        token: access_token,
        user,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // ---------------- REGISTER ----------------
  register: async (name, email, password, role) => {
    set({ isLoading: true });

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      const { access_token, user } = res.data;

      Cookies.set("token", access_token, {
        expires: 7,
      });

      set({
        token: access_token,
        user,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // ---------------- LOAD USER ----------------
  loadUser: async () => {
    const token = Cookies.get("token");

    if (!token) return;

    try {
      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        user: res.data,
        token,
      });
    } catch (err) {
      Cookies.remove("token");
      set({ user: null, token: null });
    }
  },

  // ---------------- LOGOUT ----------------
  logout: () => {
    Cookies.remove("token");
    set({
      user: null,
      token: null,
    });
  },
}));