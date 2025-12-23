import AuthPages from "../pages/AuthPages.tsx";

interface RouteConfig {
  path: string;
  component: React.FunctionComponent;
}
export const publicRoutes: RouteConfig[] = [{ path: "/auth", component: AuthPages }];
export const privateRoutes: RouteConfig[] = [];
