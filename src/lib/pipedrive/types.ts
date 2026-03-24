// ── Pipedrive API types ──

import type { PipelineStatus } from "@/lib/types";

/** Pipedrive deal stages mapped to DCB pipeline statuses.
 *  These IDs correspond to the default Pipedrive pipeline stages:
 *    Stage 1 = Qualified   → "active"
 *    Stage 2 = Contact Made → "sent" / "follow_up"
 *    Stage 3 = Proposal Made → "won" / "lost"
 */
export const DEAL_STAGE_MAP: Record<PipelineStatus, number> = {
  active: 1,
  sent: 2,
  follow_up: 2,
  won: 3,
  lost: 3,
};

/** Deal status values recognised by the Pipedrive API. */
export type PipedriveDealStatus = "open" | "won" | "lost" | "deleted";

/** Maps our pipeline status to the Pipedrive deal-level status flag. */
export const DEAL_STATUS_MAP: Record<PipelineStatus, PipedriveDealStatus> = {
  active: "open",
  sent: "open",
  follow_up: "open",
  won: "won",
  lost: "lost",
};

// ── Request payloads ──

export interface CreateDealPayload {
  title: string;
  value?: string;
  currency?: string;
  person_id?: number;
  org_id?: number;
  stage_id?: number;
  status?: PipedriveDealStatus;
}

export interface UpdateDealPayload {
  title?: string;
  value?: string;
  currency?: string;
  person_id?: number;
  org_id?: number;
  stage_id?: number;
  status?: PipedriveDealStatus;
}

export interface CreatePersonPayload {
  name: string;
  email?: string[];
  phone?: string[];
}

export interface CreateOrganizationPayload {
  name: string;
  address?: string;
}

// ── Response shapes (only the fields we actually use) ──

export interface PipedriveDeal {
  id: number;
  title: string;
  value: number;
  currency: string;
  status: PipedriveDealStatus;
  stage_id: number;
  person_id: number | null;
  org_id: number | null;
  add_time: string;
  update_time: string;
}

export interface PipedrivePerson {
  id: number;
  name: string;
  email: { value: string; primary: boolean; label: string }[];
  phone: { value: string; primary: boolean; label: string }[];
  add_time: string;
  update_time: string;
}

export interface PipedriveOrganization {
  id: number;
  name: string;
  address: string | null;
  add_time: string;
  update_time: string;
}

/** Standard Pipedrive API envelope. */
export interface PipedriveResponse<T> {
  success: boolean;
  data: T | null;
  additional_data?: {
    pagination?: {
      start: number;
      limit: number;
      more_items_in_collection: boolean;
    };
  };
  error?: string;
  error_info?: string;
}

/** Shape returned by /deals/search and /persons/search. */
export interface PipedriveSearchResponse<T> {
  success: boolean;
  data: {
    items: { item: T; result_score: number }[];
  } | null;
  additional_data?: {
    pagination?: {
      start: number;
      limit: number;
      more_items_in_collection: boolean;
    };
  };
}
