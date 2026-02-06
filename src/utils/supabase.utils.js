import { createClient } from "@supabase/supabase-js";

// These should come from your environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Optional: basic safety check
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
}

// Create and export the Supabase client
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
);
