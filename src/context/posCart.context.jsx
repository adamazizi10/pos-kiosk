import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { formatMoney } from "../utils/money";

const PosCartContext = createContext(null);

const TAX_RATE = 0.13;

const initialState = {
  items: [],
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
    case "ADD_ITEM": {
      const key = action.payload.key || action.payload.productId;
      const existing = state.items.find((i) => i.key === key || i.productId === key);
      if (existing) {
        const updatedItems = state.items.map((i) =>
          i.key === key || i.productId === key
            ? {
                ...i,
                qty: i.qty + action.payload.qty,
                lineTotalCents: (i.qty + action.payload.qty) * i.unitPriceCents,
              }
            : i
        );
        return { ...state, items: updatedItems };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload,
            key,
            lineTotalCents: action.payload.qty * action.payload.unitPriceCents,
          },
        ],
      };
    }
    case "INCREMENT": {
      const updatedItems = state.items.map((i) =>
        i.key === action.payload || i.productId === action.payload
          ? { ...i, qty: i.qty + 1, lineTotalCents: (i.qty + 1) * i.unitPriceCents }
          : i
      );
      return { ...state, items: updatedItems };
    }
    case "DECREMENT": {
      const updatedItems = state.items
        .map((i) =>
          i.key === action.payload || i.productId === action.payload
            ? {
                ...i,
                qty: i.qty > 1 ? i.qty - 1 : 1,
                lineTotalCents:
                  (i.qty > 1 ? i.qty - 1 : 1) * i.unitPriceCents,
              }
            : i
        )
        .filter((i) => i.qty > 0);
      return { ...state, items: updatedItems };
    }
    case "REMOVE": {
      return { ...state, items: state.items.filter((i) => i.key !== action.payload && i.productId !== action.payload) };
    }
    case "CLEAR": {
      return initialState;
    }
    case "RESET_ALL": {
      return initialState;
    }
    default:
      return state;
  }
};

export const PosCartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [cashSelectedCents, setCashSelectedCents] = useState(0);
  const [lastSuccessfulTransaction, setLastSuccessfulTransaction] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [orderType, setOrderType] = useState("TAKEOUT");
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [pendingPaymentId, setPendingPaymentId] = useState(null);
  const [pendingClientSecret, setPendingClientSecret] = useState(null);

  // allow logout to force a reset on next mount
  useEffect(() => {
    const resetFlag = localStorage.getItem("POS_CART_RESET");
    if (resetFlag) {
      dispatch({ type: "RESET_ALL" });
      setCashSelectedCents(0);
      setLastSuccessfulTransaction(null);
      localStorage.removeItem("POS_CART_RESET");
      setCustomerName("");
      setSpecialInstructions("");
      setPickupTime("");
      setOrderType("TAKEOUT");
      setPendingOrderId(null);
      setPendingPaymentId(null);
      setPendingClientSecret(null);
    }

  }, []);

  const subtotalCents = state.items.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + taxCents;

  const value = useMemo(
    () => ({
      items: state.items,
      subtotalCents,
      taxCents,
      totalCents,
      subtotalLabel: formatMoney(subtotalCents),
      taxLabel: formatMoney(taxCents),
      totalLabel: formatMoney(totalCents),
      cashSelectedCents,
      setCashSelectedCents,
      addItem: ({ product, qty = 1, selectedOptions = {} }) => {
        const key = `${product.id}::${stableOptionsKey(selectedOptions)}`;
        dispatch({
          type: "ADD_ITEM",
          payload: {
            key,
            productId: product.id,
            name: product.name,
            unitPriceCents: product.price_cents,
            imageUrl: product.image_url,
            selectedOptions,
            qty,
          },
        });
      },
      increment: (key) => dispatch({ type: "INCREMENT", payload: key }),
      decrement: (key) => dispatch({ type: "DECREMENT", payload: key }),
      remove: (key) => dispatch({ type: "REMOVE", payload: key }),
      clear: () => dispatch({ type: "CLEAR" }),
      customerName,
      specialInstructions,
      pickupTime,
      orderType,
      setCustomerName,
      setSpecialInstructions,
      setPickupTime,
      setOrderType,
      pendingOrderId,
      pendingPaymentId,
      setPendingOrderId,
      setPendingPaymentId,
      pendingClientSecret,
      setPendingClientSecret,
      lastSuccessfulTransaction,
      setLastSuccessfulTransaction: (snapshot) =>
        setLastSuccessfulTransaction(snapshot || null),
      clearLastSuccessfulTransaction: () => setLastSuccessfulTransaction(null),
      resetCartForNewSale: () => {
        dispatch({ type: "CLEAR" });
        setCashSelectedCents(0);
        setCustomerName("");
        setSpecialInstructions("");
        setPickupTime("");
        setOrderType("TAKEOUT");
        setPendingOrderId(null);
        setPendingPaymentId(null);
        setPendingClientSecret(null);
      },
      resetAll: () => {
        dispatch({ type: "RESET_ALL" });
        setCashSelectedCents(0);
        setLastSuccessfulTransaction(null);
        setCustomerName("");
        setSpecialInstructions("");
        setPickupTime("");
        setOrderType("TAKEOUT");
        setPendingOrderId(null);
        setPendingPaymentId(null);
        setPendingClientSecret(null);
      },
    }),
    [
      state.items,
      subtotalCents,
      taxCents,
      totalCents,
      cashSelectedCents,
      lastSuccessfulTransaction,
      customerName,
      specialInstructions,
      pickupTime,
      orderType,
      pendingOrderId,
      pendingPaymentId,
      pendingClientSecret,
    ]
  );

  return <PosCartContext.Provider value={value}>{children}</PosCartContext.Provider>;
};

export const usePosCartContext = () => {
  const context = useContext(PosCartContext);
  if (!context) {
    throw new Error("usePosCartContext must be used within PosCartProvider");
  }
  return context;
};
