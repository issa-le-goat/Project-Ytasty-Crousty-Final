import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  id: number;
  restaurantId: string;
  customerName: string;
  type: string;
  items: any[];
  status: 'pending' | 'preparing' | 'ready';
}

const initialState = {
  isCheckoutOpen: false,
  diningOption: null as 'sur_place' | 'a_emporter' | null,
  activeStep: 0,
  currentOrderId: null as number | null,
  allOrders: [] as Order[],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    openCheckout: (state) => {
      state.isCheckoutOpen = true;
      state.diningOption = null;
      state.currentOrderId = null;
      state.activeStep = 0;
    },
    closeCheckout: (state) => {
      state.isCheckoutOpen = false;
    },
    setDiningOption: (state, action: PayloadAction<'sur_place' | 'a_emporter'>) => {
      state.diningOption = action.payload;
    },
    placeOrder: (state, action: PayloadAction<{ restaurantId: string; customerName: string; items: any[] }>) => {
      const newOrder: Order = {
        id: Date.now(),
        restaurantId: action.payload.restaurantId,
        customerName: action.payload.customerName,
        type: state.diningOption!,
        items: action.payload.items,
        status: 'pending'
      };
      state.allOrders.push(newOrder);
      state.currentOrderId = newOrder.id;
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: number; status: 'pending' | 'preparing' | 'ready' }>) => {
      const order = state.allOrders.find(o => o.id === action.payload.orderId);
      if (order) order.status = action.payload.status;
    },
    // Remplace les WebSockets en lisant l'état local
    syncClientStep: (state) => {
      if (state.currentOrderId) {
        const order = state.allOrders.find(o => o.id === state.currentOrderId);
        if (order) {
          if (order.status === 'pending') state.activeStep = 0;
          else if (order.status === 'preparing') state.activeStep = 1;
          else if (order.status === 'ready') state.activeStep = 2;
        }
      }
    }
  }
});

export const { openCheckout, closeCheckout, setDiningOption, placeOrder, updateOrderStatus, syncClientStep } = orderSlice.actions;
export default orderSlice.reducer;