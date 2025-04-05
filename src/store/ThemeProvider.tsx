import { useEffect } from "react";
import useThemeStore, { themes } from "../store/themeStore";

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const selectedTheme = themes[theme];

    Object.entries(selectedTheme).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      document.documentElement.style.setProperty(cssVar, value);
    });
  }, [theme]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: themes[theme]?.backgroundColor,
        color: themes[theme]?.textColor,
      }}
    >
      {children}
    </div>
  );
};

export default ThemeProvider;
