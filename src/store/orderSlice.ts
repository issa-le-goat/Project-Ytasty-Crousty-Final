import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Simulation de l'envoi de la commande vers le back-end (POST /orders)
export const submitOrder = createAsyncThunk(
  'order/submitOrder',
  async (orderData: { type: string, items: any[] }) => {
    await new Promise((resolve) => setTimeout(resolve, 1500)); 
    return Math.floor(Math.random() * 10000); // Retourne un faux numéro de ticket
  }
);

interface OrderState {
  isCheckoutOpen: boolean;
  diningOption: 'sur_place' | 'a_emporter' | null;
  status: 'idle' | 'submitting' | 'succeeded';
  orderNumber: number | null;
  activeStep: number; // 0: En attente, 1: Préparation, 2: Prêt
}

const initialState: OrderState = {
  isCheckoutOpen: false,
  diningOption: null,
  status: 'idle',
  orderNumber: null,
  activeStep: 0,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    openCheckout: (state) => {
      state.isCheckoutOpen = true;
      state.status = 'idle';
      state.activeStep = 0;
      state.orderNumber = null;
    },
    closeCheckout: (state) => {
      state.isCheckoutOpen = false;
    },
    setDiningOption: (state, action: PayloadAction<'sur_place' | 'a_emporter'>) => {
      state.diningOption = action.payload;
    },
    // Action manuelle pour simuler l'avancement de la cuisine (remplacera Socket.io plus tard)
    advanceStep: (state) => {
      if (state.activeStep < 2) state.activeStep += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = 'submitting';
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderNumber = action.payload;
      });
  },
});

export const { openCheckout, closeCheckout, setDiningOption, advanceStep } = orderSlice.actions;
export default orderSlice.reducer;