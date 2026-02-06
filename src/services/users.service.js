import { supabase } from "@/utils/supabase.utils";

const invokeAdminUsers = async (payload) => {
  const { data, error } = await supabase.functions.invoke("admin-users", {
    body: payload,
  });

  if (error) {
    throw new Error(error.message || "Admin users request failed");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};

export async function listProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, role, is_active, last_login_at, last_logout_at, created_at, last_updated_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to load users");
  }

  return data || [];
}

export async function createProfile({
  full_name,
  email,
  password,
  role,
  is_active = true,
}) {
  return invokeAdminUsers({
    action: "create",
    full_name,
    email,
    password,
    role,
    is_active,
  });
}

export async function updateProfile(id, patch) {
  return invokeAdminUsers({
    action: "update",
    user_id: id,
    ...patch,
  });
}

export async function deleteProfile(id) {
  return invokeAdminUsers({
    action: "delete",
    user_id: id,
  });
}

export async function resetProfilePassword(id, newPassword) {
  return invokeAdminUsers({
    action: "reset_password",
    user_id: id,
    new_password: newPassword,
  });
}
