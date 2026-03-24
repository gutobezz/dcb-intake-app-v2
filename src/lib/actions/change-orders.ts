"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ChangeOrderLineItem } from "@/lib/types";

export interface DbChangeOrder {
  id: string;
  proposal_id: string;
  type: "increase" | "decrease";
  line_items: ChangeOrderLineItem[];
  scope_description: string | null;
  timeline_extension_days: number;
  total_amount: string | null;
  docusign_envelope_id: string | null;
  status: "draft" | "sent" | "signed";
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateChangeOrderInput {
  proposal_id: string;
  type: "increase" | "decrease";
  line_items: ChangeOrderLineItem[];
  scope_description?: string;
  timeline_extension_days?: number;
  total_amount?: string;
  status?: "draft" | "sent" | "signed";
}

export interface UpdateChangeOrderInput {
  proposal_id?: string;
  type?: "increase" | "decrease";
  line_items?: ChangeOrderLineItem[];
  scope_description?: string;
  timeline_extension_days?: number;
  total_amount?: string;
  status?: "draft" | "sent" | "signed";
}

export async function createChangeOrder(input: CreateChangeOrderInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("change_orders")
    .insert({
      ...input,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/change-orders");
  return { data: data as DbChangeOrder };
}

export async function updateChangeOrder(
  id: string,
  input: UpdateChangeOrderInput
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("change_orders")
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

  revalidatePath("/change-orders");
  return { data: data as DbChangeOrder };
}

export async function deleteChangeOrder(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("change_orders")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/change-orders");
  return { success: true };
}

export async function getChangeOrder(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("change_orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: data as DbChangeOrder };
}

export async function listChangeOrders() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("change_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data: (data ?? []) as DbChangeOrder[] };
}
