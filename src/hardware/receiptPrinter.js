import { printReceiptQZ } from "@/qz/qzService";

const PRINTER_NAME = "POS-80C";

/**
 * Format receipt data into ESC/POS commands for thermal printer
 */
const formatReceiptData = (payload) => {
  const ESC = "\x1B";
  const GS = "\x1D";
  
  // ESC/POS Commands
  const INIT = `${ESC}@`; // Initialize printer
  const ALIGN_CENTER = `${ESC}a\x01`;
  const ALIGN_LEFT = `${ESC}a\x00`;
  const ALIGN_RIGHT = `${ESC}a\x02`;
  const BOLD_ON = `${ESC}E\x01`;
  const BOLD_OFF = `${ESC}E\x00`;
  const DOUBLE_HEIGHT = `${GS}!\x01`;
  const NORMAL_SIZE = `${GS}!\x00`;
  const CUT_PAPER = `${GS}V\x41\x03`; // Partial cut
  const LINE_FEED = "\n";
  
  const SEPARATOR = "------------------------------------------------";
  
  let receipt = INIT;
  
  // Header
  receipt += ALIGN_CENTER;
  receipt += DOUBLE_HEIGHT + BOLD_ON;
  receipt += (payload.storeName || "Store Name") + LINE_FEED;
  receipt += NORMAL_SIZE + BOLD_OFF;
  
  if (payload.storeAddress) {
    receipt += payload.storeAddress + LINE_FEED;
  }
  if (payload.storePhone) {
    receipt += payload.storePhone + LINE_FEED;
  }
  
  receipt += LINE_FEED;
  receipt += ALIGN_LEFT;
  receipt += SEPARATOR + LINE_FEED;
  
  // Receipt Info
  receipt += BOLD_ON;
  receipt += `Receipt #: ${payload.receiptNumber || "N/A"}` + LINE_FEED;
  receipt += BOLD_OFF;
  receipt += `Date: ${new Date(payload.date || Date.now()).toLocaleString()}` + LINE_FEED;
  receipt += `Cashier: ${payload.cashier || "Unknown"}` + LINE_FEED;
  receipt += SEPARATOR + LINE_FEED;
  receipt += LINE_FEED;
  
  // Items
  if (payload.items && payload.items.length > 0) {
    payload.items.forEach(item => {
      const itemName = (item.name || "Item").padEnd(30, " ");
      const qty = `x${item.quantity || 1}`;
      const price = `$${(item.price || 0).toFixed(2)}`.padStart(10, " ");
      
      receipt += itemName + LINE_FEED;
      receipt += `  ${qty}`.padEnd(35, " ") + price + LINE_FEED;
    });
    
    receipt += LINE_FEED;
  }
  
  receipt += SEPARATOR + LINE_FEED;
  
  // Totals
  const subtotal = payload.subtotal || 0;
  const tax = payload.tax || 0;
  const total = payload.total || subtotal + tax;
  const paid = payload.amountPaid || total;
  const change = paid - total;
  
  receipt += "Subtotal:".padEnd(38, " ") + `$${subtotal.toFixed(2)}`.padStart(10, " ") + LINE_FEED;
  receipt += "Tax:".padEnd(38, " ") + `$${tax.toFixed(2)}`.padStart(10, " ") + LINE_FEED;
  receipt += BOLD_ON;
  receipt += "TOTAL:".padEnd(38, " ") + `$${total.toFixed(2)}`.padStart(10, " ") + LINE_FEED;
  receipt += BOLD_OFF;
  
  if (paid > 0) {
    receipt += LINE_FEED;
    receipt += "Amount Paid:".padEnd(38, " ") + `$${paid.toFixed(2)}`.padStart(10, " ") + LINE_FEED;
    if (change > 0) {
      receipt += "Change:".padEnd(38, " ") + `$${change.toFixed(2)}`.padStart(10, " ") + LINE_FEED;
    }
  }
  
  receipt += SEPARATOR + LINE_FEED;
  receipt += LINE_FEED;
  
  // Footer
  receipt += ALIGN_CENTER;
  if (payload.footerMessage) {
    receipt += payload.footerMessage + LINE_FEED;
  }
  receipt += "Thank you for your business!" + LINE_FEED;
  receipt += LINE_FEED;
  
  // Cut paper
  receipt += LINE_FEED + LINE_FEED + LINE_FEED;
  receipt += CUT_PAPER;
  
  return receipt;
};

export const printReceipt = async (payload) => {
  try {
    const qzOk = !!window?.qz;
    if (!qzOk) {
      console.error("❌ QZ Tray is not running. Please start QZ Tray.");
      return { 
        success: false, 
        provider: "NONE", 
        printer: PRINTER_NAME, 
        printedAt: new Date().toISOString(),
        error: "QZ Tray not detected. Please install and run QZ Tray."
      };
    }

    // Format receipt data
    const receiptData = formatReceiptData(payload);
    
    // Print using QZ Tray
    await printReceiptQZ(PRINTER_NAME, receiptData);
    
    console.log("🖨️ Receipt printed successfully via QZ Tray");
    
    return {
      success: true,
      provider: "QZ_TRAY",
      printer: PRINTER_NAME,
      printedAt: new Date().toISOString(),
      receiptNumber: payload.receiptNumber
    };
  } catch (err) {
    console.error("❌ Receipt printing failed:", err);
    return { 
      success: false, 
      provider: "ERROR", 
      printer: PRINTER_NAME, 
      printedAt: new Date().toISOString(), 
      error: err?.message || String(err) 
    };
  }
};