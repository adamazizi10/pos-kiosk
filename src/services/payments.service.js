import { supabase } from "@/utils/supabase.utils";

export const normalizePaymentStatus = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (["PAID", "SUCCEEDED"].includes(normalized)) return "PAID";
  if (["FAILED", "PAYMENTFAILED"].includes(normalized)) return "FAILED";
  if (["CANCELED", "CANCELLED", "VOIDED"].includes(normalized)) return "CANCELED";
  if (["REFUNDED"].includes(normalized)) return "REFUNDED";
  if (["PROCESSING"].includes(normalized)) return "PROCESSING";
  if (["REQUIRES_PAYMENT"].includes(normalized)) return "PENDING";
  return normalized || "UNKNOWN";
};

export const isPaymentCaptured = (payment) => {
  const status = String(payment?.status || "").toUpperCase();
  return Boolean(
    payment?.captured_at ||
      ["PAID", "SUCCEEDED", "REFUNDED"].includes(status)
  );
};

export const isPaymentCanceled = (payment) => {
  const status = String(payment?.status || "").toUpperCase();
  return Boolean(
    payment?.canceled_at ||
      ["CANCELED", "CANCELLED", "VOIDED"].includes(status)
  );
};

export const getRemainingRefundableCents = (payment) => {
  const amountCents = Number(payment?.amount_cents || 0);
  const refundedCents = Number(payment?.amount_refunded_cents || 0);
  return Math.max(amountCents - refundedCents, 0);
};

export const listPayments = async () => {
  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      id,
      order_id,
      status,
      method,
      amount_cents,
      amount_refunded_cents,
      provider,
      provider_payment_intent_id,
      provider_charge_id,
      created_at,
      finalized_at,
      captured_at,
      canceled_at,
      cancel_reason,
      failure_code,
      failure_reason,
      orders (
        order_number,
        source,
        customer_name,
        subtotal_cents,
        tax_cents,
        total_cents,
        created_at,
        paid_at
      ),
      receipts (
        receipt_number,
        created_at
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to load payments");
  }

  return data || [];
};

export const fetchPaymentDetails = async (paymentId) => {
  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      *,
      orders (
        order_number,
        source,
        customer_name,
        subtotal_cents,
        tax_cents,
        total_cents,
        created_at,
        paid_at,
        order_items (
          product_id,
          name_snapshot,
          qty,
          line_total_cents,
          unit_price_cents_snapshot,
          selected_options
        )
      ),
      receipts (
        receipt_number,
        created_at,
        content_json
      ),
      refunds (
        id,
        amount_cents,
        reason,
        status,
        provider_refund_id,
        created_at,
        processed_at,
        failure_code,
        failure_reason
      )
    `
    )
    .eq("id", paymentId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to load payment details");
  }

  return data || null;
};

export const voidPayment = async ({ paymentId, reason, deviceId }) => {
  const { data, error } = await supabase.functions.invoke("void-payment", {
    body: {
      payment_id: paymentId,
      reason,
      device_id: deviceId || null,
    },
  });

  if (error) {
    throw new Error(error.message || "Void failed");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};

export const refundPayment = async ({
  paymentId,
  amountCents,
  reason,
  idempotencyKey,
  deviceId,
}) => {
  const { data, error } = await supabase.functions.invoke("refund-payment", {
    body: {
      payment_id: paymentId,
      amount_cents: amountCents,
      reason,
      idempotency_key: idempotencyKey,
      device_id: deviceId || null,
    },
  });

  if (error) {
    throw new Error(error.message || "Refund failed");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};
