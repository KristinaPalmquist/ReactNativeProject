import { createSlice } from "@reduxjs/toolkit";

// const usersSlice = createSlice({
//   name: "selectedUsers",
//   initialState: { selectedUsers: [] },
//   reducers: {
//     addUser: (state, action) => {
//       state.selectedUsers = state.selectedUsers.push(action.payload)
//     },
//     removeUser: (state, action) => {
//       state.selectedUsers = state.selectedUsers.splice(action.payload, 1)
//     },
//   },
// });

// spara data vid start
const initialState = {
  selectedUsers: undefined,
};

// funktion som skapar en slice i redux store
export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      // skapa åtkomst till datan som skickas med
      state.selectedUsers = state.selectedUsers.push(action.payload);
    },
    // klipper åtkomst
    removeUser: (state, action) => {
      state.selectedUsers = state.selectedUsers.splice(action.payload, 1);
    },
  },
});

export const { addUser, removeUser } = usersSlice.actions;

export default usersSlice.reducer;
