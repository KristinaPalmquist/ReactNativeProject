import { createSlice } from "@reduxjs/toolkit";

// spara data vid start
const initialState = {
  loggedInAs: undefined,
};

// funktion som skapar en slice i redux store
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn: (state, action) => {
      // skapa åtkomst till datan som skickas med
      state.loggedInAs = action.payload;
    },
    // klipper åtkomst
    logOut: (state) => {
      state.loggedInAs = undefined;
    },
  },
});

export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
