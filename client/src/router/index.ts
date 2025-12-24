import LoginPages from "../pages/LoginPages/LoginPages.tsx";
import RegisterPages from "../pages/RegisterPages/RegisterPages.tsx";
import TodosPages from "../pages/TodosPages/TodosPages.tsx";
import { publicRoutesConfig, privateRoutesConfig } from "../utils/const";

interface RouteConfig {
  path: string;
  component: React.FunctionComponent;
}

export const publicRoutes: RouteConfig[] = [
  {
    path: publicRoutesConfig.LOGIN,
    component: LoginPages,
  },
  { path: publicRoutesConfig.REGISTER, component: RegisterPages },
];

export const privateRoutes: RouteConfig[] = [{ path: privateRoutesConfig.TODOS, component: TodosPages }];
