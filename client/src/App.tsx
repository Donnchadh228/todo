import { useEffect } from "react";
import AppRouter from "./components/AppRouter.tsx";
import NavBar from "./components/UI/NavBar/NavBar.tsx";
import { checkAuth } from "./store/action-creators/auth/checkAuth.ts";

import { useTypedSelector } from "./hooks/useTypedSelector.ts";
import { useAppDispatch } from "./store/index.ts";
import MyLoader from "./components/UI/MyLoader/MyLoader.tsx";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthLoading } = useTypedSelector(state => state.user);

  useEffect(() => {
    setTimeout(() => {
      dispatch(checkAuth());
    }, 0);
  }, []);
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
