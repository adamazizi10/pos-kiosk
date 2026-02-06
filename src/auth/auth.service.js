import { supabase } from "@/utils/supabase.utils";

export async function signUpAdmin(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(error.message || "Failed to sign up");
  }

  const user = data?.user || data?.session?.user;
  let profileError = null;

  if (user) {
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, role: "ADMIN", is_active: true });

    if (upsertError) {
      profileError = upsertError;
    }
  }

  return {
    user: user || null,
    session: data?.session || null,
    profileError,
  };
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Failed to sign in");
  }

  return {
    user: data?.user || null,
    session: data?.session || null,
  };
}

export async function createUserSession(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_sessions")
    .insert({ user_id: userId })
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message || "Failed to create user session");
  }
  return data;
}

export async function closeLatestUserSession(userId) {
  if (!userId) return null;
  const { data: session, error: sessionError } = await supabase
    .from("user_sessions")
    .select("id")
    .eq("user_id", userId)
    .is("logged_out_at", null)
    .order("logged_in_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message || "Failed to load user session");
  }

  if (!session?.id) return null;

  const { data, error } = await supabase
    .from("user_sessions")
    .update({ logged_out_at: new Date().toISOString() })
    .eq("id", session.id)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to close user session");
  }

  return data;
}

export async function logout(userId) {
  if (userId) {
    try {
      await closeLatestUserSession(userId);
    } catch (err) {
      console.error("Failed to close user session", err);
    }
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message || "Failed to sign out");
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message || "Failed to get session");
  }
  return data?.session || null;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
