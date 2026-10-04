import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // tes reducers viendront ici (restaurant, cart, auth)
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;