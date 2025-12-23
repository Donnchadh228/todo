import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import NavBar from "./components/UI/NavBar/NavBar.tsx";
import AppRouter from "./components/AppRouter.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <NavBar />
    <AppRouter />
  </BrowserRouter>,
  // </StrictMode>
);
