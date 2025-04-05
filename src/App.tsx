import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import LoadingSpinner from "@components/LoadingSpinner";
import routes from "@routes/Routes";

const App: React.FC = () => {
  const routing = useRoutes(routes);

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
