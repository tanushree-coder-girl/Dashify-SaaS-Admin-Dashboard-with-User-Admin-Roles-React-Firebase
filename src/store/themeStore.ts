import { create } from "zustand";

// Theme Type Definition
interface Theme {
  backgroundColor: string;
  surfaceColor: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  textSecondaryColor: string;
  borderColor: string;
  errorColor: string;
  successColor: string;
  diagramColor1: string;
  diagramColor2: string;
  diagramColor3: string;
}

// Define ThemeStore Type
interface ThemeState {
  theme: keyof typeof themes;
  setTheme: (newTheme: keyof typeof themes) => void;
}

export const themes: Record<string, Theme> = {
  theme_navy_dark: {
    backgroundColor: "#15191C",
    surfaceColor: "#1D2328",
    primaryColor: "linear-gradient(45deg, #62cff4, #2c67f2)",
    secondaryColor: "linear-gradient(45deg, #ff9800, #ff5722)",
    textColor: "#ffffff",
    textSecondaryColor: "#b3b3b3",
    borderColor: "#444b54",
    errorColor: "#ff4c4c",
    successColor: "#16c79a",
    diagramColor1: "#62cff4",
    diagramColor2: "#2c67f2",
    diagramColor3: "#ff9800",
  },
  theme_red_dark: {
    backgroundColor: "#000000",
    surfaceColor: "#2b0000",
    primaryColor: "linear-gradient(45deg, #950101, #ff0000)",
    secondaryColor: "linear-gradient(45deg, #ffcc00, #ff6600)",
    textColor: "#ffffff",
    textSecondaryColor: "#d6a2a2",
    borderColor: "#444444",
    errorColor: "#ff3333",
    successColor: "#00e676",
    diagramColor1: "#ff0000",
    diagramColor2: "#ff6600",
    diagramColor3: "#ffd700",
  },
  theme_purple_dark: {
    backgroundColor: "#2a2438",
    surfaceColor: "#352f44",
    primaryColor: "linear-gradient(45deg, #d8d8e3, #5c5470)",
    secondaryColor: "linear-gradient(45deg, #ffcc00, #ffa500)",
    textColor: "#ffffff",
    textSecondaryColor: "#d1cfd4",
    borderColor: "#544e66",
    errorColor: "#e63946",
    successColor: "#06d6a0",
    diagramColor1: "#d8d8e3",
    diagramColor2: "#5c5470",
    diagramColor3: "#ffa500",
  },
  theme_magenta_dark: {
    backgroundColor: "#000000",
    surfaceColor: "#240046",
    primaryColor: "linear-gradient(45deg, #700b97, #8e05c2)",
    secondaryColor: "linear-gradient(45deg, #ff0080, #ff00ff)",
    textColor: "#ffffff",
    textSecondaryColor: "#d3b3ff",
    borderColor: "#5e268c",
    errorColor: "#e84118",
    successColor: "#44bd32",
    diagramColor1: "#8e05c2",
    diagramColor2: "#ff00ff",
    diagramColor3: "#ff69b4",
  },
  theme_rose_dark: {
    backgroundColor: "#000000",
    surfaceColor: "#3a0a1e",
    primaryColor: "linear-gradient(45deg, #e41f7b, #86003c)",
    secondaryColor: "linear-gradient(45deg, #ff4500, #ff6347)",
    textColor: "#ffffff",
    textSecondaryColor: "#ffb3c6",
    borderColor: "#802346",
    errorColor: "#d00000",
    successColor: "#70e000",
    diagramColor1: "#e41f7b",
    diagramColor2: "#ff6347",
    diagramColor3: "#ffd6e0",
  },
  theme_orange_dark: {
    backgroundColor: "#222831",
    surfaceColor: "#2d2f36",
    primaryColor: "linear-gradient(45deg, #ff7f11, #d65a00)",
    secondaryColor: "linear-gradient(45deg, #ffc107, #ff9800)",
    textColor: "#eeeeee",
    textSecondaryColor: "#b3b3b3",
    borderColor: "#444b54",
    errorColor: "#ff4b5c",
    successColor: "#26de81",
    diagramColor1: "#ff7f11",
    diagramColor2: "#d65a00",
    diagramColor3: "#ffc107",
  },
  theme_cyan_dark: {
    backgroundColor: "#222831",
    surfaceColor: "#283038",
    primaryColor: "linear-gradient(45deg, #20e7e7, #18b6b6)",
    secondaryColor: "linear-gradient(45deg, #00ffcc, #009688)",
    textColor: "#fafafa",
    textSecondaryColor: "#b3e3e3",
    borderColor: "#445059",
    errorColor: "#ff3e4d",
    successColor: "#4cd137",
    diagramColor1: "#20e7e7",
    diagramColor2: "#18b6b6",
    diagramColor3: "#00ffcc",
  },
  theme_pastel_light: {
    backgroundColor: "#f5f5f5",
    surfaceColor: "#ffffff",
    primaryColor: "linear-gradient(45deg, #4facfe, #00f2fe)",
    secondaryColor: "linear-gradient(45deg, #43e97b, #38f9d7)",
    textColor: "#1a1a1a",
    textSecondaryColor: "#666666",
    borderColor: "#b0b0b0",
    errorColor: "#d32f2f",
    successColor: "#388e3c",
    diagramColor1: "#4facfe",
    diagramColor2: "#00f2fe",
    diagramColor3: "#43e97b",
  },
  theme_mint_light: {
    backgroundColor: "#e8f5e9",
    surfaceColor: "#ffffff",
    primaryColor: "linear-gradient(45deg, #00c9a7, #92fe9d)", // mint green gradient
    secondaryColor: "linear-gradient(45deg, #81ecec, #74b9ff)", // aqua-blue
    textColor: "#2e2e2e",
    textSecondaryColor: "#4f4f4f",
    borderColor: "#a0c4a8",
    errorColor: "#d63031",
    successColor: "#00b894",
    diagramColor1: "#00c9a7", // mint
    diagramColor2: "#74b9ff", // blue
    diagramColor3: "#81ecec", // aqua
  },
  theme_sunset_light: {
    backgroundColor: "#fff8f0",
    surfaceColor: "#ffffff",
    primaryColor: "linear-gradient(45deg, #ff9a9e, #fad0c4)", // peach-pink gradient
    secondaryColor: "linear-gradient(45deg, #fbc2eb, #a6c1ee)", // pink-lavender
    textColor: "#2e2e2e",
    textSecondaryColor: "#5c5c5c",
    borderColor: "#b3b3b3",
    errorColor: "#e53935",
    successColor: "#43a047",
    diagramColor1: "#ff9a9e",
    diagramColor2: "#a6c1ee",
    diagramColor3: "#fbc2eb",
  },
};

// Persist Theme in LocalStorage
const getStoredTheme = (): keyof typeof themes => {
  return (
    (localStorage.getItem("theme") as keyof typeof themes) || "theme_navy_dark"
  );
};

const useThemeStore = create<ThemeState>((set) => ({
  theme: getStoredTheme(),
  setTheme: (newTheme) => {
    localStorage.setItem("theme", newTheme);
    set({ theme: newTheme });
  },
}));

export default useThemeStore;
