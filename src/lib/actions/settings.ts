"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { User, UserRole } from "@/lib/types";

export interface ScopeTemplate {
  id: string;
  project_type: string;
  scope_key: string;
  title: string;
  description: string;
  category: string | null;
  sort_order: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// ── Users ──

export async function listUsers() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data: (data ?? []) as User[] };
}

export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify caller is admin
  const { data: caller } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!caller || caller.role !== "admin") {
    return { error: "Only admins can change roles" };
  }

  const { data, error } = await supabase
    .from("users")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { data: data as User };
}

export async function inviteUser(email: string, name: string, role: UserRole) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify caller is admin
  const { data: caller } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!caller || caller.role !== "admin") {
    return { error: "Only admins can invite users" };
  }

  // Check if user already exists
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return { error: "A user with this email already exists" };
  }

  // Create the user profile in the users table
  // The auth user will be created when they sign up / accept invite
  const { data, error } = await supabase
    .from("users")
    .insert({
      email,
      name,
      role,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { data: data as User };
}

// ── Scope Templates ──

export async function listScopeTemplates() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("scope_templates")
    .select("*")
    .order("project_type", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data: (data ?? []) as ScopeTemplate[] };
}

export async function updateScopeTemplate(
  id: string,
  input: Partial<Pick<ScopeTemplate, "title" | "description" | "is_default">>
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: caller } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!caller || caller.role !== "admin") {
    return { error: "Only admins can edit scope templates" };
  }

  const { data, error } = await supabase
    .from("scope_templates")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { data: data as ScopeTemplate };
}

export async function createScopeTemplate(input: {
  project_type: string;
  scope_key: string;
  title: string;
  description: string;
  category?: string;
  sort_order?: number;
  is_default?: boolean;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: caller } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!caller || caller.role !== "admin") {
    return { error: "Only admins can create scope templates" };
  }

  const { data, error } = await supabase
    .from("scope_templates")
    .insert(input)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { data: data as ScopeTemplate };
}
