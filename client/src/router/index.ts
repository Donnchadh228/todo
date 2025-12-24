import AuthPages from "../pages/AuthPages.tsx";
import TodosPages from "../pages/TodosPages/TodosPages.tsx";

interface RouteConfig {
  path: string;
  component: React.FunctionComponent;
}
export const publicRoutes: RouteConfig[] = [{ path: "/auth", component: AuthPages }];
export const privateRoutes: RouteConfig[] = [{ path: "/", component: TodosPages }];
