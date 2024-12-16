import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  sources: [],
  categories: [],
  authors: [],
  userPreferences: [],
  loading: false,
  error: null,
};
const API_BASE = 'http://127.0.0.1:8000'

export const listPreferences = createAsyncThunk(
  'preferences/listPreferences',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_BASE}/api/list-preferences`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUserPreferences = createAsyncThunk(
  'preferences/getUserPreferences',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_BASE}/api/preferences`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'preferences/updateUserPreferences',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${API_BASE}/api/preferences`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return window.location.href = '/';
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = action.payload.sources;
        state.categories = action.payload.categories;
        state.authors = action.payload.authors;
      })
      .addCase(listPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error listing preferences';
      })

      .addCase(getUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.userPreferences = action.payload;
      })
      .addCase(getUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching user preferences';
      })

      .addCase(updateUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error updating preferences';
      });
  },
});

export default preferencesSlice.reducer;
