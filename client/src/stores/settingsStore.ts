import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppSettings } from "@shared/schema";
import i18n from "@/lib/i18n";

interface SettingsState extends AppSettings {
  setLanguage: (lang: "te" | "en") => void;
  setOnlineMode: (enabled: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  reset: () => void;
}

const defaultSettings: AppSettings = {
  language: "te",
  onlineMode: false,
  theme: "light",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setLanguage: (lang: "te" | "en") => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
        set({ language: lang });
      },
      setOnlineMode: (enabled: boolean) => {
        set({ onlineMode: enabled });
      },
      setTheme: (theme: "light" | "dark") => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        set({ theme });
      },
      reset: () => {
        set(defaultSettings);
        i18n.changeLanguage("te");
        document.documentElement.classList.remove("dark");
      },
    }),
    {
      name: "ap-agri-guard-settings",
    }
  )
);
