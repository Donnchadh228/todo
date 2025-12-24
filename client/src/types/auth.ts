// INTERFACE
export interface User {
  id: number;
  login: string;
  role: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean; // Загрузка при логине, регистрации
  isAuthLoading: boolean; // Загрузка проверки авторизации
  isAuthenticated: boolean; // просто флаг авторизован ли
  error: string | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  tokenId: number;
}

// REDUCERS

export const AuthActionTypes = {
  FETCH_AUTH: "FETCH_AUTH",
  FETCH_AUTH_SUCCESS: "FETCH_AUTH_SUCCESS",
  FETCH_AUTH_ERROR: "FETCH_AUTH_ERROR",
  FETCH_AUTH_LOGOUT: "FETCH_AUTH_LOGOUT",
  CLEAR_ERROR: "CLEAR_ERROR",
  FETCH_AUTH_CHECK: "FETCH_AUTH_CHECK",
  FETCH_AUTH_CHECK_SUCCESS: "FETCH_AUTH_CHECK_SUCCESS",
  FETCH_AUTH_CHECK_ERROR: "FETCH_AUTH_CHECK_ERROR",
} as const;

interface FetchAuthAction {
  type: typeof AuthActionTypes.FETCH_AUTH;
}
interface FetchAuthSuccessAction {
  type: typeof AuthActionTypes.FETCH_AUTH_SUCCESS;
  payload: User;
}
interface FetchAuthErrorAction {
  type: typeof AuthActionTypes.FETCH_AUTH_ERROR;
  payload?: string;
}
interface FetchAuthLogoutAction {
  type: typeof AuthActionTypes.FETCH_AUTH_LOGOUT;
}
interface CLEAR_ERROR {
  type: typeof AuthActionTypes.CLEAR_ERROR;
}
interface FETCH_AUTH_CHECK {
  type: typeof AuthActionTypes.FETCH_AUTH_CHECK;
}
interface FETCH_AUTH_CHECK_SUCCESS {
  type: typeof AuthActionTypes.FETCH_AUTH_CHECK_SUCCESS;
  payload: User;
}
interface FETCH_AUTH_CHECK_ERROR {
  type: typeof AuthActionTypes.FETCH_AUTH_CHECK_ERROR;
}

export type AuthAction =
  | FetchAuthAction
  | FetchAuthSuccessAction
  | FetchAuthErrorAction
  | FetchAuthLogoutAction
  | CLEAR_ERROR
  | FETCH_AUTH_CHECK
  | FETCH_AUTH_CHECK_SUCCESS
  | FETCH_AUTH_CHECK_ERROR;
