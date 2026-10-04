import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Restaurant } from '../types/restaurant';

// Nos fausses données pour tester la sélection de restaurant
const mockRestaurants: Restaurant[] = [
  { 
    id: '1', 
    name: 'Ytasty Crousty Aix', 
    city: 'Aix-en-Provence', 
    address: '12 Cours Mirabeau', 
    contact: '04 42 00 00 00', 
    opening_hours: '11h00 - 23h00', 
    is_open: true 
  },
  { 
    id: '2', 
    name: 'Ytasty Crousty Lyon', 
    city: 'Lyon', 
    address: '45 Rue de la République', 
    contact: '04 78 00 00 00', 
    opening_hours: '11h00 - 23h30', 
    is_open: true 
  },
  { 
    id: '3', 
    name: 'Ytasty Crousty Nice', 
    city: 'Nice', 
    address: 'Promenade des Anglais', 
    contact: '04 93 00 00 00', 
    opening_hours: '11h00 - 22h00', 
    is_open: false 
  }
];

export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async () => {
    // On simule un petit temps de chargement
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockRestaurants;
  }
);

interface RestaurantState {
  list: Restaurant[];
  activeRestaurant: Restaurant | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: RestaurantState = {
  list: [],
  activeRestaurant: null,
  status: 'idle',
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setActiveRestaurant: (state, action: PayloadAction<string>) => {
      const selected = state.list.find(r => r.id === action.payload);
      if (selected) {
        state.activeRestaurant = selected;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        if (!state.activeRestaurant && action.payload.length > 0) {
          state.activeRestaurant = action.payload[0];
        }
      })
      .addCase(fetchRestaurants.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setActiveRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;