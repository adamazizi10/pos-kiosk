

// const STRIPE_TERMINAL_CONNECTION_TOKEN_URL = import.meta.env.VITE_STRIPE_TERMINAL_CONNECTION_TOKEN_URL;
// const STRIPE_CREATE_PAYMENT_INTENT_URL = import.meta.env.VITE_STRIPE_CREATE_PAYMENT_INTENT_URL;

// export const takeCardPayment = async ({ amountCents }) => {
//   console.log("💳 REAL CARD READER NOT IMPLEMENTED YET");
//   throw new Error("Card reader not implemented")
// }

// export const ensureReaderConnected = async () => {
//   console.log("💳 REAL CARD READER NOT IMPLEMENTED YET");
//   throw new Error("Card reader not implemented")
// }

// export const payWithCard = async ({ clientSecret }) => {
//   console.log("💳 REAL CARD READER NOT IMPLEMENTED YET");
//   if (!clientSecret) {
//     throw new Error("Card reader not implemented")
//   }
//   throw new Error("Card reader not implemented")
// }


// /hardware/cardReader.js
import { loadStripeTerminal } from "@stripe/terminal-js";
import { supabase } from "@/utils/supabase.utils";

const connectionTokenUrl =
  import.meta.env.VITE_STRIPE_TERMINAL_CONNECTION_TOKEN_URL;

const paymentIntentUrl =
  import.meta.env.VITE_STRIPE_CREATE_PAYMENT_INTENT_URL;

// Optional but recommended (filters to readers assigned to this Location)
// const locationId = import.meta.env.VITE_STRIPE_TERMINAL_LOCATION_ID;
const locationId = 'tml_GVIO8gPyLq3aev';

const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let terminal = null;
let connectedReader = null;
let initializing = null;

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("No Supabase session found");
  }
  return {
    "Content-Type": "application/json",
    apikey: anonKey,
    Authorization: `Bearer ${session.access_token}`,
  };
}

async function fetchConnectionToken() {
  const headers = await getAuthHeaders();
  const res = await fetch(connectionTokenUrl, { method: "POST", headers });
  const data = await res.json();

  if (!res.ok || !data?.secret) {
    throw new Error(data?.error || "Failed to fetch connection token");
  }

  console.log("🔑 Stripe Terminal connection token fetched (REAL)");
  return data.secret;
}

function ensureTerminal() {
  if (terminal) return terminal;

  // Stripe Terminal JS factory needs loading once
  // We'll create the instance after loadStripeTerminal resolves.
  return null;
}

export async function ensureReaderConnected() {
  if (connectedReader) {
    console.log("📡 Real Stripe reader already connected:", connectedReader?.label);
    return { terminal, reader: connectedReader };
  }

  if (initializing) return initializing;

  initializing = (async () => {
    const StripeTerminal = await loadStripeTerminal();
    console.log("📦 Stripe Terminal SDK loaded (REAL)");

    if (!terminal) {
      terminal = StripeTerminal.create({
        onFetchConnectionToken: fetchConnectionToken,
        onUnexpectedReaderDisconnect: () => {
          console.warn("⚠️ Reader unexpectedly disconnected");
          connectedReader = null;
        },
      });
      console.log("🧠 Stripe Terminal instance created (REAL)");
    }

    // Discover real readers (internet/LAN). Simulated must be false (or omitted).
    console.log("🔍 Discovering real readers...", { locationId: locationId || "(none)" });

    const discoverResult = await terminal.discoverReaders({
      simulated: false,
      ...(locationId ? { location: locationId } : {}),
    });

    if (discoverResult.error) {
      throw new Error(discoverResult.error.message);
    }

    const readers = discoverResult.discoveredReaders || [];
    if (!readers.length) {
      throw new Error(
        "No readers found. Make sure your WisePOS E is registered to your Stripe account, online, and (optionally) assigned to the Location you’re filtering by."
      );
    }

    // Pick the first reader, or implement your own selection UI here.
    const readerToConnect = readers[0];
    console.log("🔍 Reader found:", readerToConnect.label || readerToConnect.id);

    // Connect to reader
    const connectResult = await terminal.connectReader(readerToConnect, {
      // Optional: fail if it’s already connected elsewhere
      fail_if_in_use: true,
    });

    if (connectResult.error) {
      throw new Error(connectResult.error.message);
    }

    connectedReader = connectResult.reader;
    console.log("🔌 Connected to reader (REAL):", connectedReader.label);

    return { terminal, reader: connectedReader };
  })();

  try {
    return await initializing;
  } finally {
    initializing = null;
  }
}

export async function payWithCard({
  amountCents,
  currency = "cad",
  clientSecret,
}) {
  const { terminal: t } = await ensureReaderConnected();

  let secret = clientSecret;

  // If you didn’t already create a PaymentIntent, create one on your backend.
  if (!secret) {
    console.log("💳 Creating PaymentIntent (backend)", { amountCents, currency });

    const piHeaders = await getAuthHeaders();
    const piRes = await fetch(paymentIntentUrl, {
      method: "POST",
      headers: piHeaders,
      body: JSON.stringify({ amount_cents: amountCents, currency }),
    });

    const piData = await piRes.json();
    if (!piRes.ok || !piData?.client_secret) {
      throw new Error(piData?.error || "Failed to create PaymentIntent");
    }

    secret = piData.client_secret;
    console.log("🧾 PaymentIntent created");
  }

  console.log("💳 Collecting payment method on reader...");
  const collectResult = await t.collectPaymentMethod(secret);

  if (collectResult.error) {
    throw new Error(collectResult.error.message || "Collect payment failed");
  }

  console.log("👆 Payment method collected");

  console.log("💳 Processing payment...");
  const processResult = await t.processPayment(collectResult.paymentIntent);

  if (processResult.error) {
    throw new Error(processResult.error.message || "Process payment failed");
  }

  console.log("✅ CARD PAYMENT APPROVED", processResult.paymentIntent?.id);

  return { ok: true, paymentIntent: processResult.paymentIntent };
}

export const takeCardPayment = async ({ amountCents, currency }) =>
  payWithCard({ amountCents, currency });
