import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useThemeStore from "@store/themeStore";
import "./assets/styles/globals.css";
import ThemeProvider from "@store/ThemeProvider";
import App from "@/App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@context/AuthContext";

const queryClient = new QueryClient();

const Root: React.FC = () => {
  const { theme } = useThemeStore();

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <div className={theme}>
              <ToastContainer position="top-right" autoClose={3000} />
              <App />
            </div>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
