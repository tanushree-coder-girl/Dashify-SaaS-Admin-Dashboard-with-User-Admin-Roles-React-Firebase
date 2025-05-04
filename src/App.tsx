import { Suspense, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import LoadingSpinner from "@components/LoadingSpinner";
import routes from "@routes/Routes";
import { toast } from "react-toastify";

const App: React.FC = () => {
  const routing = useRoutes(routes);

  useEffect(() => {
    toast.info(
      "Test Credentials - Admin => admin@example.com password: Admin@123 | User: user@gmail.com password: User@123",
      {
        position: "bottom-right",
        autoClose: 7000,
      }
    );
  }, []);

  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      {routing}
    </Suspense>
  );
};

export default App;
