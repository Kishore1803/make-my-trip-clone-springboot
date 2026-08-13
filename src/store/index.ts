import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: any | null;
}

const saveUserToLocalStorage = (user: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

const removeUserFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      saveUserToLocalStorage(action.payload);
    },

    clearUser: (state) => {
      state.user = null;
      removeUserFromLocalStorage();
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;