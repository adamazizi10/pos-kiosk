import { openCashDrawer } from "@/hardware";

export const recordCashDrawerSale = async ({
  supabase,
  amountCents,
  userId,
  openDrawer = false,
}) => {
  const { data: drawer, error: drawerErr } = await supabase
    .from("cash_drawers")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (drawerErr || !drawer) {
    console.error("[cash-drawer] no drawer found", drawerErr);
    return;
  }

  const { error: rpcErr } = await supabase.rpc(
    "record_cash_drawer_event_and_update_balance",
    {
      p_cash_drawer_id: drawer.id,
      p_type: "CASH_SALE",
      p_delta_cents: Number(amountCents),
      p_user_id: userId || null,
    }
  );

  if (rpcErr) {
    console.error("[cash-drawer] rpc failed", rpcErr);
    return;
  }

  if (openDrawer) {
    try {
      await openCashDrawer();
    } catch (e) {
      console.error("Failed to open cash drawer", e);
    }
  }
};
