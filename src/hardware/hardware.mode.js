// const mode = (import.meta.env.VITE_HARDWARE_MODE || "MOCK").toUpperCase();

// export const isMockMode = mode !== "HARDWARE";
// export const isHardwareMode = mode === "HARDWARE";

// export default {
//   isMockMode,
//   isHardwareMode,
// };


const getMode = (key, defaultValue = "MOCK") => 
  (import.meta.env[key] || defaultValue).toUpperCase();

// export const isMockPrinter = getMode("VITE_PRINTER_MODE") !== "HARDWARE";
// export const isMockPaymentCardReader = getMode("VITE_CARD_READER_MODE") !== "HARDWARE";
// export const isMockCashDrawer = getMode("VITE_CASH_DRAWER_MODE") !== "HARDWARE";

export const isMockPrinter = true
export const isMockPaymentCardReader = true
export const isMockCashDrawer = true

export default {
  isMockPrinter,
  isMockPaymentCardReader,
  isMockCashDrawer,
};