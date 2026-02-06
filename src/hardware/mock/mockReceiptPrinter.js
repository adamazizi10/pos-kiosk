export const printReceipt = async (payload) => {
  const receipt = {
    ...payload,
    printedAt: new Date().toISOString(),
    provider: "MOCK",
  };
  console.log(`
    🖨️ MOCK RECEIPT PRINTED
    
    ==============================
    ORDER #${receipt.orderNumber}
    ${new Date(receipt.timestamp).toLocaleString()}
    ------------------------------
    ${receipt.items
      .map(
        (i) =>
          `${i.qty} x ${i.name}  $${(i.lineTotalCents / 100).toFixed(2)}`
      )
      .join("\n")}
    ------------------------------
    Subtotal: $${(receipt.subtotalCents / 100).toFixed(2)}
    Tax:      $${(receipt.taxCents / 100).toFixed(2)}
    TOTAL:    $${(receipt.totalCents / 100).toFixed(2)}
    ------------------------------
    Paid with: ${receipt.paymentMethod}
    Cashier:  ${receipt.cashier || "—"}
    ==============================
    THANK YOU 🙂
    ==============================
    `);

  return receipt;
};
