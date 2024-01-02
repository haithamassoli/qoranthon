import { create } from "zustand";
import { createSnackbarSlice, ISnackbarState } from "./snackbarSlice";
import { createAuthSlice, IAuthState } from "./authSlice";

interface IStore extends IAuthState, ISnackbarState {}

export const useStore = create<IStore>()((...a) => ({
  ...createAuthSlice(...a),
  ...createSnackbarSlice(...a),
}));
