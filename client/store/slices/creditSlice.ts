import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface BureauScore {
  bureau: "Experian" | "TransUnion" | "Equifax";
  score: number;
  lastUpdated: string;
}

export interface ScoreFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface CreditReport {
  score: number;
  startingScore: number;
  grade: string;
  bureauScores: BureauScore[];
  scoreFactors: ScoreFactor[];
  lastPullDate: string;
  provider: "ARRAY" | "MYFICO";
}

export interface PullUsage {
  pullsUsed: number;
  maxPulls: number;
  month: string;
}

interface CreditState {
  report: CreditReport | null;
  pullUsage: PullUsage | null;
  scoreHistory: { date: string; score: number }[];
  loading: boolean;
  pulling: boolean;
  error: string | null;
}

const initialState: CreditState = {
  report: null,
  pullUsage: null,
  scoreHistory: [],
  loading: false,
  pulling: false,
  error: null,
};

export const fetchCreditReport = createAsyncThunk(
  "credit/fetchReport",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<CreditReport>("/api/credit/report");
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to fetch report",
      );
    }
  },
);

export const fetchPullUsage = createAsyncThunk(
  "credit/fetchPullUsage",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<PullUsage>("/api/credit/pull-usage");
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to fetch pull usage",
      );
    }
  },
);

export const fetchScoreHistory = createAsyncThunk(
  "credit/fetchScoreHistory",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<{ date: string; score: number }[]>(
        "/api/credit/score-history",
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to fetch score history",
      );
    }
  },
);

export const triggerCreditPull = createAsyncThunk(
  "credit/triggerPull",
  async (confirmed: boolean, { rejectWithValue }) => {
    try {
      const { data } = await api.post<CreditReport>("/api/credit/pull", {
        confirmed,
      });
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to trigger credit pull",
      );
    }
  },
);

const creditSlice = createSlice({
  name: "credit",
  initialState,
  reducers: {
    clearCreditError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreditReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchCreditReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPullUsage.fulfilled, (state, action) => {
        state.pullUsage = action.payload;
      })
      .addCase(fetchScoreHistory.fulfilled, (state, action) => {
        state.scoreHistory = action.payload;
      })
      .addCase(triggerCreditPull.pending, (state) => {
        state.pulling = true;
        state.error = null;
      })
      .addCase(triggerCreditPull.fulfilled, (state, action) => {
        state.pulling = false;
        state.report = action.payload;
      })
      .addCase(triggerCreditPull.rejected, (state, action) => {
        state.pulling = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCreditError } = creditSlice.actions;
export default creditSlice.reducer;
