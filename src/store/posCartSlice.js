import { createSelector, createSlice } from "@reduxjs/toolkit";
import { formatMoney } from "@/utils/money";

const TAX_RATE = 0.13;

const initialState = {
  items: [],
  cashSelectedCents: 0,
  lastSuccessfulTransaction: null,
  customerName: "",
  specialInstructions: "",
  pickupTime: "",
  orderType: "TAKEOUT",
  pendingOrderId: null,
  pendingPaymentId: null,
  pendingClientSecret: null,
};

const stableOptionsKey = (selectedOptions = {}) => {
  if (!selectedOptions || typeof selectedOptions !== "object") return "";
  const entries = Object.entries(selectedOptions).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  return JSON.stringify(entries);
};

const posCartSlice = createSlice({
  name: "posCart",
  initialState,
  reducers: {
    addItem: {
      reducer(state, action) {
        const key = action.payload.key || action.payload.productId;
        const existing = state.items.find(
          (i) => i.key === key || i.productId === key
        );
        if (existing) {
          existing.qty += action.payload.qty;
          existing.lineTotalCents = existing.qty * existing.unitPriceCents;
          return;
        }
        state.items.push({
          ...action.payload,
          key,
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
            imageUrl: product.image_url,
            selectedOptions,
            qty,
          },
        };
      },
    },
    increment(state, action) {
      const key = action.payload;
      const item = state.items.find(
        (i) => i.key === key || i.productId === key
      );
      if (!item) return;
      item.qty += 1;
      item.lineTotalCents = item.qty * item.unitPriceCents;
    },
    decrement(state, action) {
      const key = action.payload;
      const item = state.items.find(
        (i) => i.key === key || i.productId === key
      );
      if (!item) return;
      item.qty = item.qty > 1 ? item.qty - 1 : 1;
      item.lineTotalCents = item.qty * item.unitPriceCents;
    },
    remove(state, action) {
      const key = action.payload;
      state.items = state.items.filter(
        (i) => i.key !== key && i.productId !== key
      );
    },
    clear(state) {
      state.items = [];
    },
    resetCartForNewSale(state) {
      state.items = [];
      state.cashSelectedCents = 0;
      state.customerName = "";
      state.specialInstructions = "";
      state.pickupTime = "";
      state.orderType = "TAKEOUT";
      state.pendingOrderId = null;
      state.pendingPaymentId = null;
      state.pendingClientSecret = null;
    },
    resetAll(state) {
      state.items = [];
      state.cashSelectedCents = 0;
      state.lastSuccessfulTransaction = null;
      state.customerName = "";
      state.specialInstructions = "";
      state.pickupTime = "";
      state.orderType = "TAKEOUT";
      state.pendingOrderId = null;
      state.pendingPaymentId = null;
      state.pendingClientSecret = null;
    },
    setCashSelectedCents(state, action) {
      state.cashSelectedCents = action.payload;
    },
    setCustomerName(state, action) {
      state.customerName = action.payload;
    },
    setSpecialInstructions(state, action) {
      state.specialInstructions = action.payload;
    },
    setPickupTime(state, action) {
      state.pickupTime = action.payload;
    },
    setOrderType(state, action) {
      state.orderType = action.payload;
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
    setLastSuccessfulTransaction(state, action) {
      state.lastSuccessfulTransaction = action.payload || null;
    },
    clearLastSuccessfulTransaction(state) {
      state.lastSuccessfulTransaction = null;
    },
  },
});

export const {
  addItem,
  increment,
  decrement,
  remove,
  clear,
  resetCartForNewSale,
  resetAll,
  setCashSelectedCents,
  setCustomerName,
  setSpecialInstructions,
  setPickupTime,
  setOrderType,
  setPendingOrderId,
  setPendingPaymentId,
  setPendingClientSecret,
  setLastSuccessfulTransaction,
  clearLastSuccessfulTransaction,
} = posCartSlice.actions;

export default posCartSlice.reducer;

export const selectPosState = (state) => state.posCart;
export const selectPosItems = (state) => selectPosState(state).items;
export const selectPosCashSelectedCents = (state) =>
  selectPosState(state).cashSelectedCents;
export const selectPosLastSuccessfulTransaction = (state) =>
  selectPosState(state).lastSuccessfulTransaction;
export const selectPosCustomerName = (state) => selectPosState(state).customerName;
export const selectPosSpecialInstructions = (state) =>
  selectPosState(state).specialInstructions;
export const selectPosPickupTime = (state) => selectPosState(state).pickupTime;
export const selectPosOrderType = (state) => selectPosState(state).orderType;
export const selectPosPendingOrderId = (state) =>
  selectPosState(state).pendingOrderId;
export const selectPosPendingPaymentId = (state) =>
  selectPosState(state).pendingPaymentId;
export const selectPosPendingClientSecret = (state) =>
  selectPosState(state).pendingClientSecret;

export const selectPosSubtotalCents = createSelector(
  [selectPosItems],
  (items) => items.reduce((sum, item) => sum + item.lineTotalCents, 0)
);

export const selectPosTaxCents = createSelector(
  [selectPosSubtotalCents],
  (subtotalCents) => Math.round(subtotalCents * TAX_RATE)
);

export const selectPosTotalCents = createSelector(
  [selectPosSubtotalCents, selectPosTaxCents],
  (subtotalCents, taxCents) => subtotalCents + taxCents
);

export const selectPosSubtotalLabel = createSelector(
  [selectPosSubtotalCents],
  (subtotalCents) => formatMoney(subtotalCents)
);

export const selectPosTaxLabel = createSelector(
  [selectPosTaxCents],
  (taxCents) => formatMoney(taxCents)
);

export const selectPosTotalLabel = createSelector(
  [selectPosTotalCents],
  (totalCents) => formatMoney(totalCents)
);
