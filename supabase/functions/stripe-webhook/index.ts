// supabase/functions/stripe-webhook/index.ts
import Stripe from "https://esm.sh/stripe@14?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature, Stripe-Signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // CORS / method guards
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  // Env
  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (
    !STRIPE_SECRET_KEY ||
    !STRIPE_WEBHOOK_SECRET ||
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY
  ) {
    return new Response("Missing env vars", { status: 500, headers: corsHeaders });
  }

  // Stripe (Deno/Edge-safe)
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
  const cryptoProvider = Stripe.createSubtleCryptoProvider();
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // IMPORTANT: Verify using RAW body + Stripe-Signature header
  const body = await req.text();
  const sig =
    req.headers.get("Stripe-Signature") ??
    req.headers.get("stripe-signature") ??
    "";

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      STRIPE_WEBHOOK_SECRET,
      undefined,
      cryptoProvider,
    );
  } catch (_err) {
    return new Response("Webhook signature verification failed", {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Extract PaymentIntent id
  const obj: any = event.data.object;
  const paymentIntentId = obj?.id; // "pi_..."

  if (!paymentIntentId) {
    console.error("⚠️ No PaymentIntent id on event", { type: event.type });
    return new Response("No PaymentIntent id on event", { status: 400, headers: corsHeaders });
  }

  const logCtx = { type: event.type, paymentIntentId };
  console.log("📬 Stripe webhook received", logCtx);

  // 1) Find payment row by provider_payment_intent_id using admin client
  const { data: matchedPayments, error: matchError, status: matchStatus } = await supabaseAdmin
    .from("payments")
    .select("id,order_id,status,method,amount_cents")
    .eq("provider_payment_intent_id", paymentIntentId);

  if (matchError || !matchedPayments || matchedPayments.length === 0) {
    console.error("⚠️ Payment row not found", logCtx);
    // If Stripe calls before you stored the PI id, or you used a different Stripe account/mode
    return new Response("Payment row not found", { status: 200, headers: corsHeaders });
  }

  const payment = matchedPayments[0];
  console.log("ℹ️ Payment row found", { ...logCtx, paymentId: payment.id, orderId: payment.order_id });

  const tryUpdate = async (paymentId: string, status: string) => {
    const { error, status: httpStatus, data } = await supabaseAdmin
      .from("payments")
      .update({ status, finalized_at: new Date().toISOString() })
      .eq("id", paymentId)
      .select("id,status,method");
    if (error) {
      console.error("⚠️ Payment update failed", { ...logCtx, paymentId, statusAttempt: status, httpStatus, error: error.message });
      return false;
    }
    console.log("✅ Payment updated", { ...logCtx, paymentId, statusAttempt: status, httpStatus, data });
    return true;
  };

  const tryOrderUpdate = async (status: string) => {
    const { error, status: httpStatus } = await supabaseAdmin
      .from("orders")
      .update({ status, paid_at: new Date().toISOString() })
      .eq("id", payment.order_id);
    if (error) {
      console.error("⚠️ Order update failed", { ...logCtx, orderId: payment.order_id, statusAttempt: status, httpStatus });
    }
  };

  // Helper to log payments snapshot for an order
  const logPaymentsSnapshot = async (orderId: string, label: string) => {
    const { data, error, status: httpStatus } = await supabaseAdmin
      .from("payments")
      .select("id,method,status,amount_cents,provider,provider_payment_intent_id")
      .eq("order_id", orderId);
    if (error) {
      console.error(`⚠️ Failed to list payments (${label})`, { ...logCtx, orderId, httpStatus, error: error.message });
      return;
    }
    console.log(`ℹ️ Payments snapshot (${label})`, { ...logCtx, orderId, payments: data });
    return data;
  };

  // 2) Update DB based on event type with safe fallbacks
  if (event.type === "payment_intent.succeeded") {
    const orderId = payment.order_id;
    await logPaymentsSnapshot(orderId, "before finalize");
    const first = await tryUpdate(payment.id, "PAID");
    if (!first) {
      const second = await tryUpdate(payment.id, "SUCCEEDED");
      if (!second) {
        return new Response("failed to update payment to success", { status: 500, headers: corsHeaders });
      }
    }
    // Finalize pending siblings (e.g., cash) using admin client
    const { data: finalized, error: finalizeError, status: finalizeStatus } = await supabaseAdmin
      .from("payments")
      .update({ status: "SUCCEEDED", finalized_at: new Date().toISOString() })
      .eq("order_id", orderId)
      .eq("status", "REQUIRES_PAYMENT")
      .select("id,method,status");

    if (finalizeError) {
      console.error("⚠️ Finalize pending payments failed", {
        ...logCtx,
        orderId,
        httpStatus: finalizeStatus,
        error: finalizeError.message,
      });
      return new Response("failed to finalize split payments", { status: 500, headers: corsHeaders });
    }

    console.log("✅ Finalized pending payments", {
      ...logCtx,
      orderId,
      finalizedCount: Array.isArray(finalized) ? finalized.length : 0,
      finalized,
    });

    const verifyRows = (await logPaymentsSnapshot(orderId, "after finalize")) || [];
    const anyNotSucceeded = verifyRows.some((p: any) => p.status !== "SUCCEEDED");
    if (anyNotSucceeded) {
      console.error("⚠️ Not all payments succeeded after finalize", {
        ...logCtx,
        orderId,
        payments: verifyRows,
      });
      return new Response("failed to finalize split payments", { status: 500, headers: corsHeaders });
    }

    await tryOrderUpdate("PAID");
  } else if (event.type === "payment_intent.payment_failed") {
    const first = await tryUpdate(payment.id, "FAILED");
    if (!first) {
      const second = await tryUpdate(payment.id, "PAYMENTFAILED");
      if (!second) {
        return new Response("failed to update payment to failed", { status: 500, headers: corsHeaders });
      }
    }
    // Cancel any pending cash for this order
    const { data: canceled, error: cancelError, status: cancelStatus } = await supabaseAdmin
      .from("payments")
      .update({ status: "CANCELLED", finalized_at: new Date().toISOString() })
      .eq("order_id", payment.order_id)
      .eq("method", "CASH")
      .eq("status", "REQUIRES_PAYMENT")
      .select("id,method,status");

    if (cancelError) {
      console.error("⚠️ Cancel cash payments failed", {
        ...logCtx,
        orderId: payment.order_id,
        httpStatus: cancelStatus,
        error: cancelError.message,
      });
    }

    await logPaymentsSnapshot(payment.order_id, "after failure");
  }

  return new Response("ok", { status: 200, headers: corsHeaders });
});
