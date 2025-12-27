import GroupPage from "../pages/GroupsPage/GroupPage.tsx";
import LoginPage from "../pages/LoginPage/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage/RegisterPage.tsx";
import TodosPage from "../pages/TodosPage/TodosPage.tsx";
import { publicRoutesConfig, privateRoutesConfig } from "../utils/const";

interface RouteConfig {
  path: string;
  component: React.FunctionComponent;
}

export const publicRoutes: RouteConfig[] = [
  {
    path: publicRoutesConfig.LOGIN,
    component: LoginPage,
  },
  { path: publicRoutesConfig.REGISTER, component: RegisterPage },
];

export const privateRoutes: RouteConfig[] = [
  { path: privateRoutesConfig.TODOS, component: TodosPage },
  { path: privateRoutesConfig.GROUPS, component: GroupPage },
];
