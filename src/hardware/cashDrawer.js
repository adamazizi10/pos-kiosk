import { openDrawerQZ } from "@/qz/qzService";

const PRINTER_NAME = "POS-80C";

export const openCashDrawer = async () => {
  try {
    const qzOk = !!window?.qz;
    if (!qzOk) {
      console.error("❌ QZ Tray is not running. Please start QZ Tray.");
      return { 
        success: false, 
        provider: "NONE", 
        printer: PRINTER_NAME, 
        openedAt: new Date().toISOString(),
        error: "QZ Tray not detected. Please install and run QZ Tray."
      };
    }

    await openDrawerQZ(PRINTER_NAME);
    return { 
      success: true, 
      provider: "QZ_TRAY", 
      printer: PRINTER_NAME, 
      openedAt: new Date().toISOString() 
    };
  } catch (err) {
    return { 
      success: false, 
      provider: "ERROR", 
      printer: PRINTER_NAME, 
      openedAt: new Date().toISOString(), 
      error: err?.message || String(err) 
    };
  }
};