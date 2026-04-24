import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface User {
  id: number;
  email: string;
  name: string;
  identityType: "SSN" | "ITIN" | null;
  subscriptionStatus:
    | "inactive"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled";
  locale: "en" | "es-MX" | "fr";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

/** Called once after Clerk sign-in to create/update our DB user record. */
export const syncUser = createAsyncThunk(
  "auth/syncUser",
  async (payload: { email: string; name: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post<User>("/api/auth/sync", payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "User sync failed");
    }
  },
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<User>("/api/auth/me");
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to fetch user",
      );
    }
  },
);

export const updateLocale = createAsyncThunk(
  "auth/updateLocale",
  async (locale: string, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<User>("/api/auth/locale", { locale });
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to update locale",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // syncUser
      .addCase(syncUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(syncUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchMe
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
      })
      // updateLocale
      .addCase(updateLocale.fulfilled, (state, action) => {
        if (state.user) {
          state.user.locale = action.payload.locale;
        }
      });
  },
});

export const { clearError, clearUser } = authSlice.actions;
export default authSlice.reducer;
