export const openCashDrawer = async () => {
  const result = { success: true, openedAt: new Date().toISOString(), provider: "MOCK" };
  console.log(`
    ============================
     
    CASH DRAWER OPENED (MOCK)
     
    ============================
    `, result);
  return result;
};
