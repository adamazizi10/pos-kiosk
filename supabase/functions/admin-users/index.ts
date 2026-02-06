import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const getAuthToken = (req: Request) => {
  const header = req.headers.get("Authorization") || "";
  return header.replace("Bearer ", "").trim();
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const allowedRoles = new Set(["ADMIN", "EMPLOYEE", "KIOSK_ROLE"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return jsonResponse({ error: "Missing Supabase environment variables" }, 500);
    }

    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    const authHeader = req.headers.get("Authorization") || "";
    console.log("AUTH HEADER:", authHeader);
    const token = getAuthToken(req);
    console.log("TOKEN LEN:", token?.length || 0);
    if (!token) {
      return jsonResponse({ error: "Missing auth token" }, 401);
    }

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { data: callerProfile, error: callerError } = await supabaseAdmin
      .from("profiles")
      .select("id, role, is_active")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (
      callerError ||
      !callerProfile ||
      callerProfile.role !== "ADMIN" ||
      callerProfile.is_active === false
    ) {
      return jsonResponse({ error: "Forbidden" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    if (!action) {
      return jsonResponse({ error: "Missing action" }, 400);
    }

    if (action === "create") {
      const { full_name, email, password, role, is_active } = body || {};

      if (!email || !password || !role) {
        return jsonResponse({ error: "Email, password, and role are required" }, 400);
      }
      if (!allowedRoles.has(String(role))) {
        return jsonResponse({ error: "Invalid role" }, 400);
      }

      const { data: created, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (createError || !created?.user) {
        return jsonResponse(
          { error: createError?.message || "Failed to create user" },
          400
        );
      }

      const profilePayload = {
        id: created.user.id,
        full_name: full_name || "",
        email,
        role,
        is_active: is_active !== false,
      };

      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert(profilePayload);

      if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(created.user.id);
        return jsonResponse(
          { error: profileError.message || "Failed to create profile" },
          400
        );
      }

      return jsonResponse({ success: true, user_id: created.user.id });
    }

    if (action === "update") {
      const { user_id, full_name, email, password, role, is_active } = body || {};

      if (!user_id) {
        return jsonResponse({ error: "user_id is required" }, 400);
      }
      if (role && !allowedRoles.has(String(role))) {
        return jsonResponse({ error: "Invalid role" }, 400);
      }

      if (email || password) {
        const { error: updateAuthError } =
          await supabaseAdmin.auth.admin.updateUserById(user_id, {
            email: email || undefined,
            password: password || undefined,
            email_confirm: email ? true : undefined,
          });

        if (updateAuthError) {
          return jsonResponse(
            { error: updateAuthError.message || "Failed to update auth user" },
            400
          );
        }
      }

      const profileUpdates: Record<string, unknown> = {};
      if (full_name !== undefined) profileUpdates.full_name = full_name;
      if (email !== undefined) profileUpdates.email = email;
      if (role !== undefined) profileUpdates.role = role;
      if (is_active !== undefined) profileUpdates.is_active = is_active;

      if (Object.keys(profileUpdates).length) {
        const { error: profileUpdateError } = await supabaseAdmin
          .from("profiles")
          .update(profileUpdates)
          .eq("id", user_id);

        if (profileUpdateError) {
          return jsonResponse(
            { error: profileUpdateError.message || "Failed to update profile" },
            400
          );
        }
      }

      return jsonResponse({ success: true });
    }

    if (action === "reset_password") {
      const { user_id, new_password } = body || {};

      if (!user_id || !new_password) {
        return jsonResponse({ error: "user_id and new_password are required" }, 400);
      }

      const { error: resetError } =
        await supabaseAdmin.auth.admin.updateUserById(user_id, {
          password: new_password,
        });

      if (resetError) {
        return jsonResponse(
          { error: resetError.message || "Failed to reset password" },
          400
        );
      }

      return jsonResponse({ success: true });
    }

    if (action === "delete") {
      const { user_id } = body || {};

      if (!user_id) {
        return jsonResponse({ error: "user_id is required" }, 400);
      }

      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
        user_id
      );

      if (deleteError) {
        return jsonResponse(
          { error: deleteError.message || "Failed to delete user" },
          400
        );
      }

      const { error: profileDeleteError } = await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", user_id);

      if (profileDeleteError) {
        return jsonResponse(
          { error: profileDeleteError.message || "Failed to delete profile" },
          400
        );
      }

      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: "Unsupported action" }, 400);
  } catch (err: any) {
    return jsonResponse(
      { error: err?.message || "Unknown error" },
      500
    );
  }
});
