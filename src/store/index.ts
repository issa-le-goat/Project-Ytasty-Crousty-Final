import { configureStore } from '@reduxjs/toolkit';
import restaurantReducer from './restaurantSlice';
import catalogReducer from './catalogSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice'; // Nouvel import

export const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
    catalog: catalogReducer,
    cart: cartReducer,
    order: orderReducer, // Ajout au store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;