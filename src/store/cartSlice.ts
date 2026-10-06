import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean; 
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      if (!action.payload.is_available) return;
      
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find(item => item.id === action.payload);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter(item => item.id !== action.payload);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
});

export const { toggleCart, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;