import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";

import { likesApi } from "./api/likesApi";
import { postsApi } from "./api/postsApi";
import { usersApi } from "./api/usersApi";
import authSlice from "./slices/authSlice";
import usersSlice from "./slices/usersSlice";

const middlewares = [
  usersApi.middleware,
  postsApi.middleware,
  likesApi.middleware,
];

const persistConfig = {
  key: "crossplatform-mobile-v1.0.0",
  storage: AsyncStorage,
  whitelist: ["auth", "users"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    [usersApi.reducerPath]: usersApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [likesApi.reducerPath]: likesApi.reducer,
    auth: authSlice,
    users: usersSlice,
    // eslint-disable-next-line prettier/prettier
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
        ],
      },
    }).concat(...middlewares),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
