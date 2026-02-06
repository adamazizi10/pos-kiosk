// src/qz/qzService.js

import { supabase } from "@/utils/supabase.utils";

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let qzInstance = null;

async function getQZ() {
  if (typeof window === "undefined") {
    throw new Error("QZ Tray can only run in the browser");
  }

  if (!qzInstance) {
    const mod = await import("qz-tray");
    qzInstance = mod.default || mod;
  }

  return qzInstance;
}

const CERT_URL = "/qz-public.crt";
const SIGN_URL = import.meta.env.VITE_QZ_SIGN;

let securityConfigured = false;

export async function configureQZSecurity() {
  if (securityConfigured) return;
  securityConfigured = true;

  const qz = await getQZ();

  // Match your Edge Function (SHA-1)
  qz.security.setSignatureAlgorithm("SHA1");

  // Certificate promise MUST be (resolve, reject) => { ... } (not async)
  qz.security.setCertificatePromise((resolve, reject) => {
    fetch(CERT_URL, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load cert: ${res.status}`);
        const certText = await res.text();

        if (!certText.includes("BEGIN CERTIFICATE")) {
          console.warn(
            "⚠️ /qz-public.crt did not include 'BEGIN CERTIFICATE'. Make sure it's a PEM cert file."
          );
        }

        resolve(certText);
      })
      .catch((err) => {
        console.error("❌ QZ certificate load failed:", err);
        reject(err);
      });
  });

  // Signature promise MUST return a function (resolve, reject) => { ... }
  qz.security.setSignaturePromise((dataToSign) => {
    return (resolve, reject) => {
      (async () => {
        if (!SIGN_URL) {
          throw new Error(
            "Missing VITE_QZ_SIGN env var. Set it to https://<PROJECT_REF>.functions.supabase.co/qz-sign"
          );
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error("No Supabase session found");
        }

        const res = await fetch(SIGN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ data: dataToSign }),
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`Signing failed: ${res.status} ${msg}`);
        }

        const json = await res.json();
        if (!json?.signature) throw new Error("Missing signature in response");

        resolve(json.signature); // base64
      })().catch((err) => {
        console.error("❌ QZ signing failed:", err);
        reject(err);
      });
    };
  });
}

export async function connectQZ() {
  await configureQZSecurity();
  const qz = await getQZ();

  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }
}

export async function openDrawerQZ(printerName) {
  if (!printerName) throw new Error("openDrawerQZ requires printerName");

  await connectQZ();
  const qz = await getQZ();

  // ESC/POS cash drawer kick (pin 2)
  const KICK_DRAWER = "\x1B\x70\x00\x19\xFA";

  const config = qz.configs.create(printerName);
  const data = [{ type: "raw", format: "command", data: KICK_DRAWER }];

  return qz.print(config, data);
}

export async function printReceiptQZ(printerName, receiptData) {
  if (!printerName) throw new Error("printReceiptQZ requires printerName");
  if (!receiptData) throw new Error("printReceiptQZ requires receiptData");

  await connectQZ();
  const qz = await getQZ();

  const config = qz.configs.create(printerName);
  const data = [
    { 
      type: "raw", 
      format: "command", 
      data: receiptData 
    }
  ];

  return qz.print(config, data);
}

export async function disconnectQZ() {
  const qz = await getQZ();
  if (qz.websocket.isActive()) {
    await qz.websocket.disconnect();
  }
}