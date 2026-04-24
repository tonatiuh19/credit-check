import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type {
  BillingStatusDTO,
  CancelSubscriptionResponse,
  EmbeddedCheckoutResponse,
  SubscribeResponse,
} from "@shared/api";

interface BillingState {
  checkoutClientSecret: string | null;
  portalUrl: string | null;
  status: BillingStatusDTO | null;
  canceling: boolean;
  canceledAt: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: BillingState = {
  checkoutClientSecret: null,
  portalUrl: null,
  status: null,
  canceling: false,
  canceledAt: null,
  loading: false,
  error: null,
};

export const createCheckoutSession = createAsyncThunk(
  "billing/createCheckout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post<EmbeddedCheckoutResponse>(
        "/api/billing/checkout",
        {},
      );
      return data.clientSecret;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to create checkout session",
      );
    }
  },
);

export const openBillingPortal = createAsyncThunk(
  "billing/portal",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post<{ url: string }>(
        "/api/billing/portal",
        {},
      );
      return data.url;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to open billing portal",
      );
    }
  },
);

export const fetchBillingStatus = createAsyncThunk(
  "billing/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<BillingStatusDTO>("/api/billing/status");
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to fetch billing status",
      );
    }
  },
);

export const cancelSubscription = createAsyncThunk(
  "billing/cancel",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post<CancelSubscriptionResponse>(
        "/api/billing/cancel",
        {},
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to cancel subscription",
      );
    }
  },
);

export const confirmSubscription = createAsyncThunk(
  "billing/confirmSubscription",
  async (
    { paymentMethodId }: { paymentMethodId: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post<SubscribeResponse>(
        "/api/billing/subscribe",
        { paymentMethodId },
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error?.message ?? "Failed to create subscription",
      );
    }
  },
);

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    clearBillingError(state) {
      state.error = null;
    },
    clearCheckout(state) {
      state.checkoutClientSecret = null;
    },
    resetCancel(state) {
      state.canceling = false;
      state.canceledAt = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutClientSecret = action.payload;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(openBillingPortal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(openBillingPortal.fulfilled, (state, action) => {
        state.loading = false;
        state.portalUrl = action.payload;
      })
      .addCase(openBillingPortal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBillingStatus.fulfilled, (state, action) => {
        state.status = action.payload;
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.canceling = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.canceling = false;
        state.canceledAt = action.payload.cancelAt;
        if (state.status) {
          state.status.cancelAtPeriodEnd = true;
        }
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.canceling = false;
        state.error = action.payload as string;
      })
      .addCase(confirmSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmSubscription.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(confirmSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBillingError, clearCheckout, resetCancel } =
  billingSlice.actions;
export default billingSlice.reducer;
