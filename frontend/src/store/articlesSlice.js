import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  articles: {},
  loading: false,
  error: null,
};

const API_BASE = 'http://127.0.0.1:8000'

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (args, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      let url = `${API_BASE}/api/articles?`;

      if (args.keyword) {
        url = `${API_BASE}/api/articles/search?keyword=${encodeURIComponent(args.keyword)}`;
      }
      if (args.page) url += `&page=${encodeURIComponent(args.page)}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Error fetching articles' });
    }
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    resetArticles(state) {
      state.articles = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching articles';
      });
  },
});

export const { resetArticles } = articlesSlice.actions;

export default articlesSlice.reducer;
