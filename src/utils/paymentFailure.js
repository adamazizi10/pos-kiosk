import { supabase } from "@/utils/supabase.utils";

const FINAL_FAILURE_STATUSES = ["FAILED", "PAYMENTFAILED", "CANCELLED"];
const FINAL_SUCCESS_STATUSES = ["PAID", "SUCCEEDED"];

const getErrorMessage = (error) => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error?.message === "string") return error.message;
  if (typeof error?.error === "string") return error.error;
  if (typeof error?.error?.message === "string") return error.error.message;
  if (typeof error?.data?.message === "string") return error.data.message;
  return String(error);
};

const getFailureCode = ({ status, error, message }) => {
  const explicitCode =
    error?.code ||
    error?.decline_code ||
    error?.error?.code ||
    error?.error?.decline_code;
  if (typeof explicitCode === "string" && explicitCode.trim()) {
    return explicitCode.trim();
  }

  const normalized = message.toLowerCase();
  if (normalized.includes("cancel")) return "user_cancelled";
  if (normalized.includes("timeout")) return "timeout";
  if (normalized.includes("declin")) return "card_declined";
  if (normalized.includes("disconnected")) return "terminal_disconnected";
  if (normalized.includes("connection token")) return "terminal_connection_failed";
  if (normalized.includes("reader")) return "terminal_error";
  if (normalized.includes("payment intent")) return "payment_intent_failed";
  if (normalized.includes("collect payment")) return "payment_collection_failed";
  if (normalized.includes("process payment")) return "payment_processing_failed";

  if (status === "CANCELLED") return "user_cancelled";
  return "payment_failed";
};

const getFailureReason = ({ status, message }) => {
  if (message) return message;
  if (status === "CANCELLED") return "Payment cancelled";
  return "Payment failed";
};

const deriveFailureDetails = ({ status, error }) => {
  const message = getErrorMessage(error);
  const failureCode = getFailureCode({ status, error, message });
  const failureReason = getFailureReason({ status, message });
  return { failureCode, failureReason };
};

export const persistPaymentFailure = async ({
  orderId,
  status,
  error,
  method,
  amountCents,
  provider,
}) => {
  if (!orderId) return;

  const finalStatus = FINAL_FAILURE_STATUSES.includes(status) ? status : "FAILED";
  const { failureCode, failureReason } = deriveFailureDetails({
    status: finalStatus,
    error,
  });

  const { data: latest, error: latestError } = await supabase
    .from("payments")
    .select("id, status, failure_code, failure_reason, method")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) {
    console.warn("Failed to load latest payment for failure update", latestError);
    return;
  }

  const shouldInsert =
    !latest || (method && latest.method && latest.method !== method);

  if (shouldInsert) {
    if (!method || !Number.isFinite(amountCents)) return;
    const { error: insertError } = await supabase.from("payments").insert({
      order_id: orderId,
      status: finalStatus,
      method,
      amount_cents: amountCents,
      provider: provider || "OTHER",
      failure_code: failureCode,
      failure_reason: failureReason,
    });
    if (insertError) {
      console.warn("Failed to insert failed payment record", insertError);
    }
    return;
  }

  if (FINAL_SUCCESS_STATUSES.includes(latest.status)) return;

  const effectiveStatus = FINAL_FAILURE_STATUSES.includes(latest.status)
    ? latest.status
    : finalStatus;

  if (!FINAL_FAILURE_STATUSES.includes(effectiveStatus)) return;

  const nextFailureCode = latest.failure_code || failureCode;
  const nextFailureReason = latest.failure_reason || failureReason;

  if (
    latest.status === effectiveStatus &&
    latest.failure_code === nextFailureCode &&
    latest.failure_reason === nextFailureReason
  ) {
    return;
  }

  const { error: updateError } = await supabase
    .from("payments")
    .update({
      status: effectiveStatus,
      failure_code: nextFailureCode,
      failure_reason: nextFailureReason,
    })
    .eq("id", latest.id);

  if (updateError) {
    console.warn("Failed to persist payment failure details", updateError);
  }
};
