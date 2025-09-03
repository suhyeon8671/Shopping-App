
import { configureStore } from '@reduxjs/toolkit';
import productSlice from './productSlice';
import authSlice from './authSlice';
import cartSlice from './cartSlice';
import orderSlice from './orderSlice';

export const store = configureStore({
  reducer: {
    products: productSlice,
    cart: cartSlice,
    auth: authSlice,
    orders: orderSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
