import { createContext, useContext, useMemo, useReducer } from "react";

const KioskCartContext = createContext(null);

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

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const key = action.payload.key;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === key
              ? {
                  ...i,
                  qty: i.qty + action.payload.qty,
                  lineTotalCents: (i.qty + action.payload.qty) * i.unitPriceCents,
                }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload,
            lineTotalCents: action.payload.qty * action.payload.unitPriceCents,
          },
        ],
      };
    }
    case "INCREMENT": {
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === action.payload
            ? { ...i, qty: i.qty + 1, lineTotalCents: (i.qty + 1) * i.unitPriceCents }
            : i
        ),
      };
    }
    case "DECREMENT": {
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.key === action.payload
              ? { ...i, qty: i.qty - 1, lineTotalCents: (i.qty - 1) * i.unitPriceCents }
              : i
          )
          .filter((i) => i.qty > 0),
      };
    }
    case "REMOVE": {
      return { ...state, items: state.items.filter((i) => i.key !== action.payload) };
    }
    case "CLEAR":
      return { ...initialState, orderType: state.orderType };
    case "SET_ORDER_TYPE":
      return { ...state, orderType: action.payload };
    case "SET_CUSTOMER_NAME":
      return { ...state, customerName: action.payload };
    case "SET_SPECIAL_INSTRUCTIONS":
      return { ...state, specialInstructions: action.payload };
    case "SET_PENDING_ORDER":
      return { ...state, pendingOrderId: action.payload };
    case "SET_PENDING_PAYMENT":
      return { ...state, pendingPaymentId: action.payload };
    case "SET_PENDING_CLIENT_SECRET":
      return { ...state, pendingClientSecret: action.payload };
    case "CLEAR_CHECKOUT_STATE":
      return {
        ...initialState,
      };
    case "SET_LAST_SUCCESS":
      return { ...state, lastSuccessfulTransaction: action.payload };
    case "RESET_AFTER_SUCCESS":
      return {
        ...state,
        items: [],
        orderType: null,
        customerName: "",
        specialInstructions: "",
        pendingOrderId: null,
        pendingPaymentId: null,
        pendingClientSecret: null,
      };
    default:
      return state;
  }
};

export const KioskCartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const subtotalCents = state.items.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.qty, 0);

  const value = useMemo(
    () => ({
      items: state.items,
      subtotalCents,
      itemCount,
      orderType: state.orderType,
      customerName: state.customerName,
      specialInstructions: state.specialInstructions,
      pendingOrderId: state.pendingOrderId,
      pendingPaymentId: state.pendingPaymentId,
      pendingClientSecret: state.pendingClientSecret,
      lastSuccessfulTransaction: state.lastSuccessfulTransaction,
      addItem: ({ product, qty = 1, selectedOptions = {} }) => {
        const key = `${product.id}::${stableOptionsKey(selectedOptions)}`;
        dispatch({
          type: "ADD",
          payload: {
            key,
            productId: product.id,
            name: product.name,
            unitPriceCents: product.price_cents,
            image_url: product.image_url,
            selectedOptions,
            qty,
          },
        });
      },
      incrementItem: (key) => dispatch({ type: "INCREMENT", payload: key }),
      decrementItem: (key) => dispatch({ type: "DECREMENT", payload: key }),
      removeItem: (key) => dispatch({ type: "REMOVE", payload: key }),
      setOrderType: (type) => dispatch({ type: "SET_ORDER_TYPE", payload: type }),
      setCustomerName: (name) => dispatch({ type: "SET_CUSTOMER_NAME", payload: name }),
      setSpecialInstructions: (text) =>
        dispatch({ type: "SET_SPECIAL_INSTRUCTIONS", payload: text }),
      setPendingOrderId: (id) => dispatch({ type: "SET_PENDING_ORDER", payload: id }),
      setPendingPaymentId: (id) => dispatch({ type: "SET_PENDING_PAYMENT", payload: id }),
      setPendingClientSecret: (secret) =>
        dispatch({ type: "SET_PENDING_CLIENT_SECRET", payload: secret }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      clearCheckoutState: () => dispatch({ type: "CLEAR_CHECKOUT_STATE" }),
      setLastSuccessfulTransaction: (snapshot) =>
        dispatch({ type: "SET_LAST_SUCCESS", payload: snapshot }),
      resetAfterSuccess: () => dispatch({ type: "RESET_AFTER_SUCCESS" }),
    }),
    [
      state.items,
      subtotalCents,
      itemCount,
      state.orderType,
      state.customerName,
      state.specialInstructions,
      state.pendingOrderId,
      state.pendingPaymentId,
      state.pendingClientSecret,
      state.lastSuccessfulTransaction,
    ]
  );

  return <KioskCartContext.Provider value={value}>{children}</KioskCartContext.Provider>;
};

export const useKioskCartContext = () => {
  const ctx = useContext(KioskCartContext);
  if (!ctx) {
    throw new Error("useKioskCartContext must be used within KioskCartProvider");
  }
  return ctx;
};
