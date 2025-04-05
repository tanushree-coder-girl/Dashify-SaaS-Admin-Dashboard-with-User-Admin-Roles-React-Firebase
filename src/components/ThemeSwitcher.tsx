import { useState } from "react";
import useThemeStore, { themes } from "@store/themeStore";
import { Palette, X } from "lucide-react";

const ThemeSwitcher: React.FC = () => {
  const { setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**
   * ontheme change handler
   * @param theme
   */
  const onThemeChangeHandler = (theme: string) => {
    setTheme(theme);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary text-theme p-4 rounded-full shadow-2xl z-50 transition-all duration-300 hover:scale-105"
      >
        <Palette size={26} />
      </button>

      {/* Theme Switcher Panel */}
      <div
        className={`z-50 fixed top-0 right-0 h-screen w-72 bg-surface text-theme shadow-xl transition-transform duration-300  theme-border ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center px-5 py-4 theme-border">
          <h3>Choose theme</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-theme hover:opacity-75 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Theme List (Color Palettes) */}
        <div className="p-5 space-y-3 overflow-y-auto max-h-[calc(100vh-70px)]">
          {Object.keys(themes).map((themeKey) => {
            const theme = themes[themeKey];

            return (
              <div
                key={themeKey}
                className="p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 bg-theme theme-border shadow-lg"
                onClick={() => onThemeChangeHandler(themeKey)}
              >
                <div className="grid grid-cols-6 gap-1">
                  {[
                    theme.backgroundColor,
                    theme.surfaceColor,
                    theme.primaryColor,
                    theme.secondaryColor,
                    theme.textColor,
                    theme.borderColor,
                  ].map((color, index) => {
                    const isGradient = color.includes("gradient");

                    return (
                      <div
                        key={index}
                        className="h-6 w-6 rounded shadow-sm"
                        style={
                          isGradient
                            ? { backgroundImage: color }
                            : { backgroundColor: color }
                        }
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ThemeSwitcher;
