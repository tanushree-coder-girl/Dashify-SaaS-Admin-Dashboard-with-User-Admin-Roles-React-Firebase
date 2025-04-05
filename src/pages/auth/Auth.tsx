import { useState } from "react";
import ThemeSwitcher from "@components/ThemeSwitcher";
import AuthForm from "@pages/auth/AuthForm";
import logo from "@assets/images/dashify_logo.png";
import useThemeStore from "@/store/themeStore";
import login_bg from "@assets/images/login_bg.png";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const { theme } = useThemeStore();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-theme text-theme">
      <div className="w-full md:w-[50%] flex flex-col justify-center items-center p-8 md:p-12">
        <div className="space-y-6 w-full max-w-sm flex justify-start mb-4">
          <img
            src={logo}
            alt="Logo"
            style={{ filter: `invert(${theme.includes("light") ? 0 : 1})` }}
            className="w-36 h-auto"
            loading="lazy"
          />
        </div>

        <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>

      <div className="hidden md:flex w-[50%] h-screen relative items-center justify-center p-6">
        <div className="absolute inset-0 bg-surface opacity-80 rounded-lg"></div>
        <img
          src={login_bg}
          loading="lazy"
          alt="Adminify Dashboard Preview"
          className="w-[85%] h-auto object-contain relative z-10"
        />
        <div className="absolute bottom-[50px] left-[10px] bg-theme bg-opacity-30 backdrop-blur-lg p-6 rounded-lg text-theme text-left shadow-xl max-w-md">
          <h2 className="text-2xl font-bold">
            Take <span className="text-primary">Full Control</span>
          </h2>
          <p className="text-secondary mt-2">
            Automate workflows, monitor analytics, and simplify management—all
            in one powerful platform.
          </p>
        </div>
      </div>

      <ThemeSwitcher />
    </div>
  );
};

export default Auth;
