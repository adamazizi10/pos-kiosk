import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addItem,
  clear,
  clearLastSuccessfulTransaction,
  decrement,
  increment,
  remove,
  resetAll,
  resetCartForNewSale,
  selectPosCashSelectedCents,
  selectPosCustomerName,
  selectPosItems,
  selectPosLastSuccessfulTransaction,
  selectPosOrderType,
  selectPosPendingClientSecret,
  selectPosPendingOrderId,
  selectPosPendingPaymentId,
  selectPosPickupTime,
  selectPosSpecialInstructions,
  selectPosSubtotalCents,
  selectPosSubtotalLabel,
  selectPosTaxCents,
  selectPosTaxLabel,
  selectPosTotalCents,
  selectPosTotalLabel,
  setCashSelectedCents,
  setCustomerName,
  setLastSuccessfulTransaction,
  setOrderType,
  setPendingClientSecret,
  setPendingOrderId,
  setPendingPaymentId,
  setPickupTime,
  setSpecialInstructions,
} from "@/store/posCartSlice";

const usePosCart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectPosItems);
  const subtotalCents = useAppSelector(selectPosSubtotalCents);
  const taxCents = useAppSelector(selectPosTaxCents);
  const totalCents = useAppSelector(selectPosTotalCents);
  const subtotalLabel = useAppSelector(selectPosSubtotalLabel);
  const taxLabel = useAppSelector(selectPosTaxLabel);
  const totalLabel = useAppSelector(selectPosTotalLabel);
  const cashSelectedCents = useAppSelector(selectPosCashSelectedCents);
  const lastSuccessfulTransaction = useAppSelector(selectPosLastSuccessfulTransaction);
  const customerName = useAppSelector(selectPosCustomerName);
  const specialInstructions = useAppSelector(selectPosSpecialInstructions);
  const pickupTime = useAppSelector(selectPosPickupTime);
  const orderType = useAppSelector(selectPosOrderType);
  const pendingOrderId = useAppSelector(selectPosPendingOrderId);
  const pendingPaymentId = useAppSelector(selectPosPendingPaymentId);
  const pendingClientSecret = useAppSelector(selectPosPendingClientSecret);

  const handleAddItem = useCallback(
    (payload) => dispatch(addItem(payload)),
    [dispatch]
  );
  const handleIncrement = useCallback((key) => dispatch(increment(key)), [dispatch]);
  const handleDecrement = useCallback((key) => dispatch(decrement(key)), [dispatch]);
  const handleRemove = useCallback((key) => dispatch(remove(key)), [dispatch]);
  const handleClear = useCallback(() => dispatch(clear()), [dispatch]);
  const handleResetCartForNewSale = useCallback(
    () => dispatch(resetCartForNewSale()),
    [dispatch]
  );
  const handleResetAll = useCallback(() => dispatch(resetAll()), [dispatch]);
  const handleSetCashSelectedCents = useCallback(
    (cents) => dispatch(setCashSelectedCents(cents)),
    [dispatch]
  );
  const handleSetCustomerName = useCallback(
    (name) => dispatch(setCustomerName(name)),
    [dispatch]
  );
  const handleSetSpecialInstructions = useCallback(
    (text) => dispatch(setSpecialInstructions(text)),
    [dispatch]
  );
  const handleSetPickupTime = useCallback(
    (time) => dispatch(setPickupTime(time)),
    [dispatch]
  );
  const handleSetOrderType = useCallback(
    (type) => dispatch(setOrderType(type)),
    [dispatch]
  );
  const handleSetPendingOrderId = useCallback(
    (id) => dispatch(setPendingOrderId(id)),
    [dispatch]
  );
  const handleSetPendingPaymentId = useCallback(
    (id) => dispatch(setPendingPaymentId(id)),
    [dispatch]
  );
  const handleSetPendingClientSecret = useCallback(
    (secret) => dispatch(setPendingClientSecret(secret)),
    [dispatch]
  );
  const handleSetLastSuccessfulTransaction = useCallback(
    (snapshot) => dispatch(setLastSuccessfulTransaction(snapshot)),
    [dispatch]
  );
  const handleClearLastSuccessfulTransaction = useCallback(
    () => dispatch(clearLastSuccessfulTransaction()),
    [dispatch]
  );

  return useMemo(
    () => ({
      items,
      subtotalCents,
      taxCents,
      totalCents,
      subtotalLabel,
      taxLabel,
      totalLabel,
      cashSelectedCents,
      setCashSelectedCents: handleSetCashSelectedCents,
      addItem: handleAddItem,
      increment: handleIncrement,
      decrement: handleDecrement,
      remove: handleRemove,
      clear: handleClear,
      customerName,
      specialInstructions,
      pickupTime,
      orderType,
      setCustomerName: handleSetCustomerName,
      setSpecialInstructions: handleSetSpecialInstructions,
      setPickupTime: handleSetPickupTime,
      setOrderType: handleSetOrderType,
      pendingOrderId,
      pendingPaymentId,
      setPendingOrderId: handleSetPendingOrderId,
      setPendingPaymentId: handleSetPendingPaymentId,
      pendingClientSecret,
      setPendingClientSecret: handleSetPendingClientSecret,
      lastSuccessfulTransaction,
      setLastSuccessfulTransaction: handleSetLastSuccessfulTransaction,
      clearLastSuccessfulTransaction: handleClearLastSuccessfulTransaction,
      resetCartForNewSale: handleResetCartForNewSale,
      resetAll: handleResetAll,
    }),
    [
      items,
      subtotalCents,
      taxCents,
      totalCents,
      subtotalLabel,
      taxLabel,
      totalLabel,
      cashSelectedCents,
      customerName,
      specialInstructions,
      pickupTime,
      orderType,
      pendingOrderId,
      pendingPaymentId,
      pendingClientSecret,
      lastSuccessfulTransaction,
      handleSetCashSelectedCents,
      handleAddItem,
      handleIncrement,
      handleDecrement,
      handleRemove,
      handleClear,
      handleSetCustomerName,
      handleSetSpecialInstructions,
      handleSetPickupTime,
      handleSetOrderType,
      handleSetPendingOrderId,
      handleSetPendingPaymentId,
      handleSetPendingClientSecret,
      handleSetLastSuccessfulTransaction,
      handleClearLastSuccessfulTransaction,
      handleResetCartForNewSale,
      handleResetAll,
    ]
  );
};

export default usePosCart;
