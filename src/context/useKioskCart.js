import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addItem,
  clearCart,
  clearCheckoutState,
  decrementItem,
  incrementItem,
  removeItem,
  resetAfterSuccess,
  selectKioskCustomerName,
  selectKioskItems,
  selectKioskItemCount,
  selectKioskLastSuccessfulTransaction,
  selectKioskOrderType,
  selectKioskPendingClientSecret,
  selectKioskPendingOrderId,
  selectKioskPendingPaymentId,
  selectKioskSpecialInstructions,
  selectKioskSubtotalCents,
  setCustomerName,
  setLastSuccessfulTransaction,
  setOrderType,
  setPendingClientSecret,
  setPendingOrderId,
  setPendingPaymentId,
  setSpecialInstructions,
} from "@/store/kioskCartSlice";

const useKioskCart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectKioskItems);
  const subtotalCents = useAppSelector(selectKioskSubtotalCents);
  const itemCount = useAppSelector(selectKioskItemCount);
  const orderType = useAppSelector(selectKioskOrderType);
  const customerName = useAppSelector(selectKioskCustomerName);
  const specialInstructions = useAppSelector(selectKioskSpecialInstructions);
  const pendingOrderId = useAppSelector(selectKioskPendingOrderId);
  const pendingPaymentId = useAppSelector(selectKioskPendingPaymentId);
  const pendingClientSecret = useAppSelector(selectKioskPendingClientSecret);
  const lastSuccessfulTransaction = useAppSelector(
    selectKioskLastSuccessfulTransaction
  );

  const handleAddItem = useCallback(
    (payload) => dispatch(addItem(payload)),
    [dispatch]
  );
  const handleIncrementItem = useCallback(
    (key) => dispatch(incrementItem(key)),
    [dispatch]
  );
  const handleDecrementItem = useCallback(
    (key) => dispatch(decrementItem(key)),
    [dispatch]
  );
  const handleRemoveItem = useCallback(
    (key) => dispatch(removeItem(key)),
    [dispatch]
  );
  const handleSetOrderType = useCallback(
    (type) => dispatch(setOrderType(type)),
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
  const handleClearCart = useCallback(() => dispatch(clearCart()), [dispatch]);
  const handleClearCheckoutState = useCallback(
    () => dispatch(clearCheckoutState()),
    [dispatch]
  );
  const handleSetLastSuccessfulTransaction = useCallback(
    (snapshot) => dispatch(setLastSuccessfulTransaction(snapshot)),
    [dispatch]
  );
  const handleResetAfterSuccess = useCallback(
    () => dispatch(resetAfterSuccess()),
    [dispatch]
  );

  return useMemo(
    () => ({
      items,
      subtotalCents,
      itemCount,
      orderType,
      customerName,
      specialInstructions,
      pendingOrderId,
      pendingPaymentId,
      pendingClientSecret,
      lastSuccessfulTransaction,
      addItem: handleAddItem,
      incrementItem: handleIncrementItem,
      decrementItem: handleDecrementItem,
      removeItem: handleRemoveItem,
      setOrderType: handleSetOrderType,
      setCustomerName: handleSetCustomerName,
      setSpecialInstructions: handleSetSpecialInstructions,
      setPendingOrderId: handleSetPendingOrderId,
      setPendingPaymentId: handleSetPendingPaymentId,
      setPendingClientSecret: handleSetPendingClientSecret,
      clearCart: handleClearCart,
      clearCheckoutState: handleClearCheckoutState,
      setLastSuccessfulTransaction: handleSetLastSuccessfulTransaction,
      resetAfterSuccess: handleResetAfterSuccess,
    }),
    [
      items,
      subtotalCents,
      itemCount,
      orderType,
      customerName,
      specialInstructions,
      pendingOrderId,
      pendingPaymentId,
      pendingClientSecret,
      lastSuccessfulTransaction,
      handleAddItem,
      handleIncrementItem,
      handleDecrementItem,
      handleRemoveItem,
      handleSetOrderType,
      handleSetCustomerName,
      handleSetSpecialInstructions,
      handleSetPendingOrderId,
      handleSetPendingPaymentId,
      handleSetPendingClientSecret,
      handleClearCart,
      handleClearCheckoutState,
      handleSetLastSuccessfulTransaction,
      handleResetAfterSuccess,
    ]
  );
};

export default useKioskCart;
