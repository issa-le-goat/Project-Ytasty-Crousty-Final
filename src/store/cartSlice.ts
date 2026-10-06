import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/product';

// On étend le type Product pour lui ajouter une notion de quantité
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
    // Ouvre ou ferme le menu latéral du panier
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    // Ajoute un produit ou incrémente sa quantité
    addToCart: (state, action: PayloadAction<Product>) => {
      if (!action.payload.is_available) return; // Sécurité supplémentaire
      
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    // Diminue la quantité ou retire le produit
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