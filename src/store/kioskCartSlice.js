import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  orderType: null,
  customerName: "",
  specialInstructions: "",
  pendingOrderId: null,
  pendingPaymentId: null,
  pendingClientSecret: null,
  lastSuccessfulTransaction: null,
};

const stableOptionsKey = (selectedOptions = {}) => {
  if (!selectedOptions || typeof selectedOptions !== "object") return "";
  const entries = Object.entries(selectedOptions).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  return JSON.stringify(entries);
};

const kioskCartSlice = createSlice({
  name: "kioskCart",
  initialState,
  reducers: {
    addItem: {
      reducer(state, action) {
        const key = action.payload.key;
        const existing = state.items.find((i) => i.key === key);
        if (existing) {
          existing.qty += action.payload.qty;
          existing.lineTotalCents = existing.qty * existing.unitPriceCents;
          return;
        }
        state.items.push({
          ...action.payload,
          lineTotalCents: action.payload.qty * action.payload.unitPriceCents,
        });
      },
      prepare({ product, qty = 1, selectedOptions = {} }) {
        const key = `${product.id}::${stableOptionsKey(selectedOptions)}`;
        return {
          payload: {
            key,
            productId: product.id,
            name: product.name,
            unitPriceCents: product.price_cents,
            image_url: product.image_url,
            selectedOptions,
            qty,
          },
        };
      },
    },
    incrementItem(state, action) {
      const item = state.items.find((i) => i.key === action.payload);
      if (!item) return;
      item.qty += 1;
      item.lineTotalCents = item.qty * item.unitPriceCents;
    },
    decrementItem(state, action) {
      const item = state.items.find((i) => i.key === action.payload);
      if (!item) return;
      item.qty -= 1;
      item.lineTotalCents = item.qty * item.unitPriceCents;
      state.items = state.items.filter((i) => i.qty > 0);
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.key !== action.payload);
    },
    clearCart(state) {
      const orderType = state.orderType;
      Object.assign(state, initialState);
      state.orderType = orderType;
    },
    setOrderType(state, action) {
      state.orderType = action.payload;
    },
    setCustomerName(state, action) {
      state.customerName = action.payload;
    },
    setSpecialInstructions(state, action) {
      state.specialInstructions = action.payload;
    },
    setPendingOrderId(state, action) {
      state.pendingOrderId = action.payload;
    },
    setPendingPaymentId(state, action) {
      state.pendingPaymentId = action.payload;
    },
    setPendingClientSecret(state, action) {
      state.pendingClientSecret = action.payload;
    },
    clearCheckoutState(state) {
      Object.assign(state, initialState);
    },
    setLastSuccessfulTransaction(state, action) {
      state.lastSuccessfulTransaction = action.payload || null;
    },
    resetAfterSuccess(state) {
      state.items = [];
      state.orderType = null;
      state.customerName = "";
      state.specialInstructions = "";
      state.pendingOrderId = null;
      state.pendingPaymentId = null;
      state.pendingClientSecret = null;
    },
  },
});

export const {
  addItem,
  incrementItem,
  decrementItem,
  removeItem,
  clearCart,
  setOrderType,
  setCustomerName,
  setSpecialInstructions,
  setPendingOrderId,
  setPendingPaymentId,
  setPendingClientSecret,
  clearCheckoutState,
  setLastSuccessfulTransaction,
  resetAfterSuccess,
} = kioskCartSlice.actions;

export default kioskCartSlice.reducer;

export const selectKioskState = (state) => state.kioskCart;
export const selectKioskItems = (state) => selectKioskState(state).items;
export const selectKioskOrderType = (state) => selectKioskState(state).orderType;
export const selectKioskCustomerName = (state) =>
  selectKioskState(state).customerName;
export const selectKioskSpecialInstructions = (state) =>
  selectKioskState(state).specialInstructions;
export const selectKioskPendingOrderId = (state) =>
  selectKioskState(state).pendingOrderId;
export const selectKioskPendingPaymentId = (state) =>
  selectKioskState(state).pendingPaymentId;
export const selectKioskPendingClientSecret = (state) =>
  selectKioskState(state).pendingClientSecret;
export const selectKioskLastSuccessfulTransaction = (state) =>
  selectKioskState(state).lastSuccessfulTransaction;

export const selectKioskSubtotalCents = createSelector(
  [selectKioskItems],
  (items) => items.reduce((sum, item) => sum + item.lineTotalCents, 0)
);

export const selectKioskItemCount = createSelector(
  [selectKioskItems],
  (items) => items.reduce((sum, item) => sum + item.qty, 0)
);
