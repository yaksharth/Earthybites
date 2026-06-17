import { create } from "zustand";

interface AdminState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  user: { email: string; role: string; name: string } | null;
  searchQuery: string;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  login: (email: string, role: string, name: string) => void;
  logout: () => void;
  setSearchQuery: (query: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  theme: "light",
  sidebarOpen: true,
  user: null,
  searchQuery: "",
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      return { theme: next };
    }),
  setTheme: (theme) =>
    set(() => {
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", theme === "dark");
      }
      return { theme };
    }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebar: (open) => set({ sidebarOpen: open }),
  login: (email, role, name) => {
    const userSession = { email, role, name };
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_user", JSON.stringify(userSession));
    }
    set({ user: userSession });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_user");
    }
    set({ user: null });
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
