import { AuthActionTypes, type AuthAction, type AuthState } from "../../types/auth.ts";

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isAuthLoading: true,
  error: null,
};

export const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.FETCH_AUTH:
      return { ...state, isLoading: true, error: null };
    case AuthActionTypes.FETCH_AUTH_SUCCESS:
      return { isLoading: false, isAuthenticated: true, isAuthLoading: false, error: null, user: action.payload };
    case AuthActionTypes.FETCH_AUTH_ERROR:
      return { ...state, isLoading: false, error: action.payload ?? "ERROR" };
    case AuthActionTypes.FETCH_AUTH_LOGOUT:
      return { ...state, isLoading: false, isAuthenticated: false, user: null };

    case AuthActionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    //check auth
    case AuthActionTypes.FETCH_AUTH_CHECK:
      return { ...state, isAuthLoading: true };
    case AuthActionTypes.FETCH_AUTH_CHECK_SUCCESS:
      return { ...state, isAuthenticated: true, isAuthLoading: false, user: action.payload };
    case AuthActionTypes.FETCH_AUTH_CHECK_ERROR:
      return { ...state, isAuthenticated: false, isAuthLoading: false };

    default:
      return state;
  }
};
