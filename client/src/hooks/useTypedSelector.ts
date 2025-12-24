import { useSelector, type TypedUseSelectorHook } from "react-redux";
import { type RootState } from "../store/reducers/index.ts";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
