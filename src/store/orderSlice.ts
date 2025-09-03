
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderItem, CartItem } from '../types';

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<CartItem[]>) => {
      const newOrder: Order = {
        id: new Date().toISOString(),
        timestamp: new Date().getTime(),
        items: action.payload.map(item => ({...item, id: String(item.id)} as OrderItem)),
        total: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
      state.orders.push(newOrder);
    },
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;
