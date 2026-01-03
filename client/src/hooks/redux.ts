import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { type RootState } from "../store/reducers/index.ts";
import type { AppDispatch } from "../store/index.ts";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
