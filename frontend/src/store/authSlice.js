import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  validationErrors: null,
};

const API_BASE = 'http://127.0.0.1:8000';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/api/register`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      const data = err.response?.data || {};
      return rejectWithValue(data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/api/login`, credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      const data = err.response?.data || {};
      return rejectWithValue(data);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwords, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        `${API_BASE}/api/change-password`,
        passwords,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      const data = err.response?.data || {};
      return rejectWithValue(data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.error = null;
      state.validationErrors = null;
      localStorage.removeItem('token');
      toast.info('Logged out successfully!');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token || null;
        if (state.token) {
          localStorage.setItem('token', state.token);
          toast.success('Registered successfully!');
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.payload?.message || 'Registration failed';
        state.validationErrors = action.payload?.errors || null;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token || null;
        if (state.token) {
          localStorage.setItem('token', state.token);
          toast.success('Login successful!');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
        state.validationErrors = action.payload?.errors || null;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        toast.success('Password Changed successfully!');
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Password change failed';
        state.validationErrors = action.payload?.errors || null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
