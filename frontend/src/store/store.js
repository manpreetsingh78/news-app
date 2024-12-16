import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import preferencesReducer from './preferencesSlice';
import articlesReducer from './articlesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
    articles: articlesReducer,
  },
});
