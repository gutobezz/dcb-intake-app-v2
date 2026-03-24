"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createDeal,
  updateDeal,
  getDeal,
  createPerson,
  findPersonByEmail,
} from "@/lib/pipedrive/client";
import {
  DEAL_STAGE_MAP,
  DEAL_STATUS_MAP,
} from "@/lib/pipedrive/types";
import type { DbProposal, ProposalStatus } from "@/lib/types";

/**
 * Sync a proposal to Pipedrive CRM.
 *
 * 1. Fetch proposal from Supabase
 * 2. Find or create the person (client) in Pipedrive by email
 * 3. Create or update the deal in Pipedrive
 * 4. Store pipedrive_deal_id back on the proposal row
 */
export async function syncProposalToPipedrive(
  proposalId: string
): Promise<{ success: boolean; dealId?: number; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Fetch proposal
    const { data: proposal, error: fetchErr } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", proposalId)
      .single();

    if (fetchErr || !proposal) {
      return {
        success: false,
        error: `Proposal not found: ${fetchErr?.message ?? "no data"}`,
      };
    }

    const p = proposal as DbProposal & { pipedrive_deal_id?: number | null };

    // 2. Find or create person in Pipedrive
    let personId: number | undefined;

    if (p.client_email) {
      const existing = await findPersonByEmail(p.client_email);

      if (existing) {
        personId = existing.id;
      } else {
        const fullName =
          [p.client_first_name, p.client_last_name]
            .filter(Boolean)
            .join(" ") || "Unknown Client";

        const person = await createPerson({
          name: fullName,
          email: p.client_email ? [p.client_email] : undefined,
          phone: p.client_phone ? [p.client_phone] : undefined,
        });
        personId = person.id;
      }
    }

    // 3. Build deal title and value
    const clientName =
      [p.client_first_name, p.client_last_name]
        .filter(Boolean)
        .join(" ") || "Unknown Client";

    const dealTitle = p.address
      ? `${clientName} — ${p.address}`
      : clientName;

    // Parse project price (remove $ and commas)
    const rawPrice = (p.project_price ?? "").replace(/[$,]/g, "");
    const dealValue = rawPrice || undefined;

    const stageId = DEAL_STAGE_MAP[p.status] ?? 1;
    const dealStatus = DEAL_STATUS_MAP[p.status] ?? "open";

    // 4. Create or update deal
    let dealId: number;

    if (p.pipedrive_deal_id) {
      // Verify the deal still exists in Pipedrive
      const existingDeal = await getDeal(p.pipedrive_deal_id);

      if (existingDeal) {
        await updateDeal(p.pipedrive_deal_id, {
          title: dealTitle,
          value: dealValue,
          currency: "USD",
          person_id: personId,
          stage_id: stageId,
          status: dealStatus,
        });
        dealId = p.pipedrive_deal_id;
      } else {
        // Deal was deleted in Pipedrive — recreate
        const newDeal = await createDeal({
          title: dealTitle,
          value: dealValue,
          currency: "USD",
          person_id: personId,
          stage_id: stageId,
          status: dealStatus,
        });
        dealId = newDeal.id;
      }
    } else {
      const newDeal = await createDeal({
        title: dealTitle,
        value: dealValue,
        currency: "USD",
        person_id: personId,
        stage_id: stageId,
        status: dealStatus,
      });
      dealId = newDeal.id;
    }

    // 5. Save deal ID back to Supabase
    if (dealId !== p.pipedrive_deal_id) {
      await supabase
        .from("proposals")
        .update({ pipedrive_deal_id: dealId })
        .eq("id", proposalId);
    }

    return { success: true, dealId };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown Pipedrive sync error";
    console.error(`[Pipedrive] syncProposalToPipedrive failed:`, message);
    return { success: false, error: message };
  }
}

/**
 * Update the Pipedrive deal stage when a proposal status changes.
 * If the proposal has no pipedrive_deal_id yet, performs a full sync instead.
 */
export async function syncStatusToPipedrive(
  proposalId: string,
  newStatus: ProposalStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: proposal, error: fetchErr } = await supabase
      .from("proposals")
      .select("pipedrive_deal_id")
      .eq("id", proposalId)
      .single();

    if (fetchErr || !proposal) {
      return {
        success: false,
        error: `Proposal not found: ${fetchErr?.message ?? "no data"}`,
      };
    }

    const dealId = (proposal as { pipedrive_deal_id?: number | null })
      .pipedrive_deal_id;

    if (!dealId) {
      // No deal yet — do a full sync which will create one
      return syncProposalToPipedrive(proposalId);
    }

    const stageId = DEAL_STAGE_MAP[newStatus] ?? 1;
    const dealStatus = DEAL_STATUS_MAP[newStatus] ?? "open";

    await updateDeal(dealId, {
      stage_id: stageId,
      status: dealStatus,
    });

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown Pipedrive status sync error";
    console.error(`[Pipedrive] syncStatusToPipedrive failed:`, message);
    return { success: false, error: message };
  }
}
