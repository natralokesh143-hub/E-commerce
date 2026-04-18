import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [], // each order { id, items: [...], total, date }
  },
  reducers: {
    addOrder: (state, action) => {
      const { items, total, paymentMode } = action.payload;
      state.orders.push({
        id: Date.now(),
        items,
        total,
        paymentMode: paymentMode || 'Unknown',
        date: new Date().toISOString(),
      });
    },
    clearOrders: (state) => {
      state.orders = [];
    },
  },
});

export const { addOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;