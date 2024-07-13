// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
// Import your reducers here
import authReducer from './auth/authSlice';
import productReducer from './product/productSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    // Add other reducers here
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
