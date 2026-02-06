// supabase/functions/qz-sign/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

serve(async (req) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase environment variables" }),
        { status: 500, headers }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "").trim();
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing auth token" }),
        { status: 401, headers }
      );
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers }
      );
    }

    const { data } = await req.json();
    
    if (!data) {
      return new Response(
        JSON.stringify({ error: "Missing 'data' field" }),
        { status: 400, headers }
      );
    }

    // Get private key from environment
    let privateKeyPem = Deno.env.get("QZ_PRIVATE_KEY");
    
    if (!privateKeyPem) {
      return new Response(
        JSON.stringify({ error: "QZ_PRIVATE_KEY not configured" }),
        { status: 500, headers }
      );
    }

    // Clean up the private key - remove headers and newlines
    privateKeyPem = privateKeyPem
      .replace(/-----BEGIN PRIVATE KEY-----/g, "")
      .replace(/-----END PRIVATE KEY-----/g, "")
      .replace(/-----BEGIN RSA PRIVATE KEY-----/g, "")
      .replace(/-----END RSA PRIVATE KEY-----/g, "")
      .replace(/\s+/g, "");

    // Convert base64 private key to binary
    const binaryDerString = atob(privateKeyPem);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    // Import the private key for signing
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-1", // QZ uses SHA-1
      },
      false,
      ["sign"]
    );

    // Sign the data
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      dataBytes
    );

    // Convert signature to base64
    const signatureArray = new Uint8Array(signature);
    let binaryString = "";
    for (let i = 0; i < signatureArray.length; i++) {
      binaryString += String.fromCharCode(signatureArray[i]);
    }
    const signatureBase64 = btoa(binaryString);

    return new Response(
      JSON.stringify({ signature: signatureBase64 }),
      { status: 200, headers }
    );

  } catch (err) {
    console.error("Signing error:", err);
    return new Response(
      JSON.stringify({ 
        error: "Signing failed", 
        details: err.message 
      }),
      { status: 500, headers }
    );
  }
});