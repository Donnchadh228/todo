import { useEffect } from "react";
import AppRouter from "./components/AppRouter.tsx";
import NavBar from "./components/UI/NavBar/NavBar.tsx";
import { useTypedSelector } from "./hooks/useTypedSelector.ts";
import MyLoader from "./components/UI/MyLoader/MyLoader.tsx";
import { useAuth } from "./hooks/useAuth.ts";

function App() {
  const { isAuthLoading } = useTypedSelector(state => state.user);
  const { handleSessionExpired } = useAuth();

  useEffect(() => {
    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [handleSessionExpired]);

  if (isAuthLoading) {
    return (
      <div className="flex-center">
        <MyLoader />
      </div>
    );
  }
  return (
    <>
      <NavBar />
      <AppRouter />
    </>
  );
}

export default App;
