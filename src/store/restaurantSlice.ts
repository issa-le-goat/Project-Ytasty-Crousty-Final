import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/axios';
import { Restaurant } from '../types/restaurant';

export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async () => {
    const response = await api.get<Restaurant[]>('/restaurants');
    return response.data;
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
      const selected = state.list.find(r => r.id === action.payload || r.id.toString() === action.payload);
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