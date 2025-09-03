
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem } from '../types';

// Defines the structure of the cart state.
interface CartState {
  items: CartItem[];
}

// Sets the initial state of the cart to be empty.
const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Adds a product to the cart. If the product is already in the cart, it increases the quantity.
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    // Removes a product from the cart completely.
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // Increases the quantity of a specific product in the cart.
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity++;
      }
    },
    // Decreases the quantity of a specific product. If the quantity becomes zero, it removes the item.
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else if (item && item.quantity === 1) {
        state.items = state.items.filter(i => i.id !== action.payload);
      }
    },
    // Clears the cart.
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
