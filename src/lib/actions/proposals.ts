"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  syncProposalToPipedrive,
  syncStatusToPipedrive,
} from "@/lib/actions/pipedrive";
import type {
  DbProposal,
  ProposalStatus,
  CreateDbProposalInput,
  UpdateDbProposalInput,
} from "@/lib/types";

export async function createProposal(input: CreateDbProposalInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("proposals")
    .insert({
      ...input,
      advisor_id: input.advisor_id || user.id,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/intake");
  revalidatePath("/library");

  // Sync new proposal to Pipedrive (non-blocking)
  syncProposalToPipedrive(data.id).catch((err) => {
    console.error("[Pipedrive] Failed to sync new proposal:", err);
  });

  return { data: data as DbProposal };
}

export async function updateProposal(
  id: string,
  input: UpdateDbProposalInput
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("proposals")
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

  revalidatePath("/intake");
  revalidatePath("/library");
  return { data: data as DbProposal };
}

export async function deleteProposal(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("proposals").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/intake");
  revalidatePath("/library");
  return { success: true };
}

export async function getProposal(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: data as DbProposal };
}

export interface ListProposalsFilters {
  status?: ProposalStatus;
  advisor_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function listProposals(filters?: ListProposalsFilters) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  let query = supabase
    .from("proposals")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.advisor_id) {
    query = query.eq("advisor_id", filters.advisor_id);
  }

  if (filters?.search) {
    const term = `%${filters.search}%`;
    query = query.or(
      `client_first_name.ilike.${term},client_last_name.ilike.${term},address.ilike.${term},project_price.ilike.${term}`
    );
  }

  const limit = filters?.limit ?? 50;
  const offset = filters?.offset ?? 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return { error: error.message };
  }

  return { data: data as DbProposal[], count };
}

export async function updateProposalStatus(
  id: string,
  status: ProposalStatus
) {
  const result = await updateProposal(id, { status });

  if (!result.error) {
    // Sync status change to Pipedrive (non-blocking)
    syncStatusToPipedrive(id, status).catch((err) => {
      console.error("[Pipedrive] Failed to sync status change:", err);
    });
  }

  return result;
}
