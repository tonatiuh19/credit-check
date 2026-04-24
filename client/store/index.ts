import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import creditReducer from "./slices/creditSlice";
import billingReducer from "./slices/billingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    credit: creditReducer,
    billing: billingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
