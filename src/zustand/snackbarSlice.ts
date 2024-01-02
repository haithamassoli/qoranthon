import { StateCreator } from "zustand";

export interface ISnackbarState {
  snackbarText: string;
}

export const createSnackbarSlice: StateCreator<ISnackbarState> = () => ({
  snackbarText: "",
});
