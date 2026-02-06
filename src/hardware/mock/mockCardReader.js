import { loadStripeTerminal } from "@stripe/terminal-js";
import { supabase } from "@/utils/supabase.utils";

const connectionTokenUrl = import.meta.env.VITE_STRIPE_TERMINAL_CONNECTION_TOKEN_URL;
const paymentIntentUrl = import.meta.env.VITE_STRIPE_CREATE_PAYMENT_INTENT_URL;
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

const fetchConnectionToken = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(connectionTokenUrl, { method: "POST", headers });
  const data = await res.json();
  if (!res.ok || !data?.secret) throw new Error(data?.error || "Failed to fetch connection token");

  console.log("🔑 Stripe Terminal connection token fetched");
  return data.secret;
};

export const ensureReaderConnected = async () => {
  if (connectedReader) {
    console.log("📡 Stripe reader already connected");
    return { terminal, reader: connectedReader };
  }

  if (initializing) return initializing;

  initializing = (async () => {
    // 1) Load the SDK factory
    const StripeTerminal = await loadStripeTerminal();
    console.log("📦 Stripe Terminal SDK loaded");

    // 2) Create Terminal instance
    if (!terminal) {
      terminal = StripeTerminal.create({
        onFetchConnectionToken: fetchConnectionToken,
        onUnexpectedReaderDisconnect: () => {
          connectedReader = null;
        },
      });

      console.log("🧠 Stripe Terminal instance created");
    }

    // 3) Discover readers
    const discoverResult = await terminal.discoverReaders({ simulated: true });
    if (discoverResult.error) throw new Error(discoverResult.error.message);

    const readers = discoverResult.discoveredReaders || [];
    if (!readers.length) throw new Error("No simulated readers found");

    console.log("🔍 Stripe reader discovered", readers[0].label);

    // 4) Connect reader
    const connectResult = await terminal.connectReader(readers[0]);
    if (connectResult.error) throw new Error(connectResult.error.message);

    connectedReader = connectResult.reader;
    console.log("🔌 Stripe reader connected", connectedReader.label);

    return { terminal, reader: connectedReader };
  })();

  try {
    return await initializing;
  } finally {
    initializing = null;
  }
};

export const payWithCard = async ({ amountCents, currency = "cad", clientSecret }) => {
  const { terminal: t } = await ensureReaderConnected();

  let secret = clientSecret;
  if (!secret) {
    console.log("💳 Creating payment intent (mock/edge)", { amountCents, currency });
    const piHeaders = await getAuthHeaders();
    const piRes = await fetch(paymentIntentUrl, {
      method: "POST",
      headers: piHeaders,
      body: JSON.stringify({ amount_cents: amountCents, currency }),
    });

    const piData = await piRes.json();
    if (!piRes.ok || !piData?.client_secret) {
      throw new Error(piData?.error || "Failed to create payment intent");
    }

    secret = piData.client_secret;
    console.log("🧾 Payment intent created");
  }

  console.log("💳 Collecting payment method");
  const collectResult = await t.collectPaymentMethod(secret);
  if (collectResult.error) {
    throw new Error(collectResult.error.message || "Collect payment failed");
  }

  console.log("👆 Card presented and payment method collected");

  console.log("💳 Processing payment");
  const processResult = await t.processPayment(collectResult.paymentIntent);
  if (processResult.error) {
    throw new Error(processResult.error.message || "Process payment failed");
  }

  console.log(
    "✅ MOCK CARD PAYMENT APPROVED",
    processResult.paymentIntent?.id
  );

  return { ok: true, paymentIntent: processResult.paymentIntent };
};

export const takeCardPayment = async ({ amountCents, currency }) =>
  payWithCard({ amountCents, currency });