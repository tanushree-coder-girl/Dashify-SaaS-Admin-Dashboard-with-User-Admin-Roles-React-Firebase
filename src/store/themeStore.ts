import { create } from "zustand";

// Theme Type Definition
interface Theme {
  backgroundColor: string; // Main background color
  surfaceColor: string; // Cards, modals, surface backgrounds
  primaryColor: string; // Primary button & highlights
  secondaryColor: string; // Secondary button & accents
  textColor: string; // Main text color
  textSecondaryColor: string; // Muted/secondary text color
  borderColor: string; // Borders & dividers
  errorColor: string; // Error messages & alerts
  successColor: string; // Success messages & alerts
}

// Define ThemeStore Type
interface ThemeState {
  theme: keyof typeof themes; // ✅ Theme key type fix
  setTheme: (newTheme: keyof typeof themes) => void;
}

export const themes: Record<string, Theme> = {
  theme1: {
    backgroundColor: "#15191C",
    surfaceColor: "#1D2328",
    primaryColor: "linear-gradient(45deg, #62cff4, #2c67f2)",
    secondaryColor: "linear-gradient(45deg, #ff9800, #ff5722)", // Warm contrast
    textColor: "#ffffff",
    textSecondaryColor: "#b3b3b3",
    borderColor: "#444b54",
    errorColor: "#ff4c4c", // Bright Red for visibility
    successColor: "#16c79a", // Muted Green
  },
  theme2: {
    backgroundColor: "#000000",
    surfaceColor: "#2b0000",
    primaryColor: "linear-gradient(45deg, #950101, #ff0000)",
    secondaryColor: "linear-gradient(45deg, #ffcc00, #ff6600)", // Fiery contrast
    textColor: "#ffffff",
    textSecondaryColor: "#d6a2a2", // Slight reddish tone for harmony
    borderColor: "#4d0b0b",
    errorColor: "#ff3333",
    successColor: "#00e676", // Vivid Green
  },
  theme3: {
    backgroundColor: "#2a2438",
    surfaceColor: "#352f44",
    primaryColor: "linear-gradient(45deg, #d8d8e3, #5c5470)",
    secondaryColor: "linear-gradient(45deg, #ffcc00, #ffa500)", // Gold pop
    textColor: "#ffffff",
    textSecondaryColor: "#d1cfd4",
    borderColor: "#544e66",
    errorColor: "#e63946", // Softer Red
    successColor: "#06d6a0", // Aqua Green
  },
  theme4: {
    backgroundColor: "#000000",
    surfaceColor: "#240046",
    primaryColor: "linear-gradient(45deg, #700b97, #8e05c2)",
    secondaryColor: "linear-gradient(45deg, #ff0080, #ff00ff)", // Neon Pink contrast
    textColor: "#ffffff",
    textSecondaryColor: "#d3b3ff",
    borderColor: "#3b0b63",
    errorColor: "#e84118", // Bright Red
    successColor: "#44bd32", // Deep Green
  },
  theme5: {
    backgroundColor: "#000000",
    surfaceColor: "#3a0a1e",
    primaryColor: "linear-gradient(45deg, #e41f7b, #86003c)",
    secondaryColor: "linear-gradient(45deg, #ff4500, #ff6347)", // Deep orange-red
    textColor: "#ffffff",
    textSecondaryColor: "#ffb3c6",
    borderColor: "#5b0a2c",
    errorColor: "#d00000", // Dark Red
    successColor: "#70e000", // Lime Green
  },
  theme6: {
    backgroundColor: "#222831",
    surfaceColor: "#2d2f36",
    primaryColor: "linear-gradient(45deg, #ff7f11, #d65a00)",
    secondaryColor: "linear-gradient(45deg, #ffc107, #ff9800)", // Warm orange contrast
    textColor: "#eeeeee",
    textSecondaryColor: "#b3b3b3",
    borderColor: "#444b54",
    errorColor: "#ff4b5c", // Coral Red
    successColor: "#26de81", // Mint Green
  },
  theme7: {
    backgroundColor: "#222831",
    surfaceColor: "#283038",
    primaryColor: "linear-gradient(45deg, #20e7e7, #18b6b6)",
    secondaryColor: "linear-gradient(45deg, #00ffcc, #009688)", // Soft teal contrast
    textColor: "#fafafa",
    textSecondaryColor: "#b3e3e3",
    borderColor: "#445059",
    errorColor: "#ff3e4d", // Light Red
    successColor: "#4cd137", // Soft Green
  },
};

// Persist Theme in LocalStorage
const getStoredTheme = (): keyof typeof themes => {
  return (localStorage.getItem("theme") as keyof typeof themes) || "theme1";
};

const useThemeStore = create<ThemeState>((set) => ({
  theme: getStoredTheme(),
  setTheme: (newTheme) => {
    localStorage.setItem("theme", newTheme); // ✅ Store in localStorage
    set({ theme: newTheme });
  },
}));

export default useThemeStore;
