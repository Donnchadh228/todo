export const publicRoutesConfig = {
  LOGIN: "/",
  REGISTER: "/register",
} as const;
export const privateRoutesConfig = {
  TODOS: "/todos",
} as const;

export const API_URL = "http://localhost:5000/api";
