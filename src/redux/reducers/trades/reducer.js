import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchTrades } from './api';

const initialState = {
  data: [],
  loading: false,
};

// Handles trades requests to local API
export const getTrades = createAsyncThunk('trades/fetchTrades', async (pair) => {
  const response = await fetchTrades(pair);
  return response.data;
});

export const trades = createSlice({
  name: 'trades',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTrades.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTrades.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});

export const selectTrades = (state) => state.trades.data;

export default trades.reducer;
