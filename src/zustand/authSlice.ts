import { StateCreator } from "zustand";
import { IUser } from "@src/types/schema";

export interface IAuthState {
  user: IUser | null;
}

export const createAuthSlice: StateCreator<IAuthState> = () => ({
  user: null,
});
