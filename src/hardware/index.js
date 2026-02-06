import { 
  isMockPrinter,
  isMockPaymentCardReader,
  isMockCashDrawer
} from "./hardware.mode";

import { printReceipt as mockPrintReceipt } from "./mock/mockReceiptPrinter";
import { openCashDrawer as mockOpenCashDrawer } from "./mock/mockCashDrawer";
import {
  takeCardPayment as mockTakeCardPayment,
  ensureReaderConnected as mockEnsureReaderConnected,
  payWithCard as mockPayWithCard,
} from "./mock/mockCardReader";

import { printReceipt as hardwarePrintReceipt } from "./receiptPrinter";
import { openCashDrawer as hardwareOpenCashDrawer } from "./cashDrawer";
import {
  takeCardPayment as hardwareTakeCardPayment,
  ensureReaderConnected as hardwareEnsureReaderConnected,
  payWithCard as hardwarePayWithCard,
} from "./cardReader";

export const printReceipt = async (payload) =>
  isMockPrinter ? mockPrintReceipt(payload) : hardwarePrintReceipt(payload);

export const openCashDrawer = async () =>
  isMockCashDrawer ? mockOpenCashDrawer() : hardwareOpenCashDrawer();

export const takeCardPayment = async (options) =>
  isMockPaymentCardReader ? mockTakeCardPayment(options) : hardwareTakeCardPayment(options);

export const ensureReaderConnected = async () =>
  isMockPaymentCardReader ? mockEnsureReaderConnected() : hardwareEnsureReaderConnected();

export const payWithCard = async (options) =>
  isMockPaymentCardReader ? mockPayWithCard(options) : hardwarePayWithCard(options);
