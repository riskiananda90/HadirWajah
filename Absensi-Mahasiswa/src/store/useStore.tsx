import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: {
    id: number;
    nim: string;
    email: string;
    nama: string;
    foto_profil?: string;
    jumlah_hadir: number;
    jumlah_sakit: number;
    jumlah_izin: number;
    jumlah_alpa: number;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserState["user"]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, isAuthenticated: !!user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      logout: () => set({ user: null, isAuthenticated: false, error: null }),
    }),
    {
      name: "user-store",
    }
  )
);

interface AppState {
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarExpanded: true,
      toggleSidebar: () =>
        set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
    }),
    {
      name: "app-store",
    }
  )
);

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data?: UserState["user"];
  token?: string;
}

export const API_URL = "https://3f7d-112-215-229-64.ngrok-free.app";
// export const API_URL = "http://localhost:5000";

export const loginUser = async (
  nim: string,
  password: string
): Promise<AuthApiResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nim, password }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Server tidak mengembalikan respons yang valid");
  }
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  if (data.token) {
    localStorage.setItem("auth_token", data.token);
  } else {
    throw new Error("Token tidak ditemukan pada respons login");
  }
  console.log(data.result);

  if (data.result) {
    localStorage.setItem("user", JSON.stringify(data.result[0]));
  }

  return data;
};

export const registerUser = async (
  nim: string,
  email: string,
  nama: string,
  password: string,
  foto_profil?: File
): Promise<AuthApiResponse> => {
  const formData = new FormData();
  formData.append("nim", nim);
  formData.append("email", email);
  formData.append("nama", nama);
  formData.append("password", password);
  if (foto_profil) {
    console.log("Foto Profil Tersedia");
    formData.append("foto_profil", foto_profil);
  }
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    body: formData,
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Server tidak mengembalikan respons yang valid");
  }

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }
  return data;
};
