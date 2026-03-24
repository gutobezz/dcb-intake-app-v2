// ── Typed Pipedrive API client ──

import type {
  CreateDealPayload,
  UpdateDealPayload,
  CreatePersonPayload,
  CreateOrganizationPayload,
  PipedriveDeal,
  PipedrivePerson,
  PipedriveOrganization,
  PipedriveResponse,
  PipedriveSearchResponse,
} from "./types";

const PIPEDRIVE_DOMAIN = process.env.PIPEDRIVE_DOMAIN;
const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;

function getBaseUrl(): string {
  if (!PIPEDRIVE_DOMAIN) {
    throw new Error("PIPEDRIVE_DOMAIN is not set");
  }
  return `https://${PIPEDRIVE_DOMAIN}/api/v1`;
}

function getToken(): string {
  if (!PIPEDRIVE_API_TOKEN) {
    throw new Error("PIPEDRIVE_API_TOKEN is not set");
  }
  return PIPEDRIVE_API_TOKEN;
}

/** Append api_token to any URL (handles existing query params). */
function withToken(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}api_token=${getToken()}`;
}

/** Generic request helper with error handling. */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<PipedriveResponse<T>> {
  const url = withToken(`${getBaseUrl()}${path}`);

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Pipedrive API error ${res.status} ${res.statusText}: ${body}`
    );
  }

  return res.json() as Promise<PipedriveResponse<T>>;
}

/** Generic search helper. */
async function searchRequest<T>(
  path: string
): Promise<PipedriveSearchResponse<T>> {
  const url = withToken(`${getBaseUrl()}${path}`);

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Pipedrive search error ${res.status} ${res.statusText}: ${body}`
    );
  }

  return res.json() as Promise<PipedriveSearchResponse<T>>;
}

// ── Deals ──

export async function createDeal(
  data: CreateDealPayload
): Promise<PipedriveDeal> {
  const res = await request<PipedriveDeal>("/deals", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.success || !res.data) {
    throw new Error(
      `Failed to create deal: ${res.error ?? "unknown error"}`
    );
  }

  return res.data;
}

export async function updateDeal(
  id: number,
  data: UpdateDealPayload
): Promise<PipedriveDeal> {
  const res = await request<PipedriveDeal>(`/deals/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!res.success || !res.data) {
    throw new Error(
      `Failed to update deal ${id}: ${res.error ?? "unknown error"}`
    );
  }

  return res.data;
}

export async function getDeal(id: number): Promise<PipedriveDeal | null> {
  const res = await request<PipedriveDeal>(`/deals/${id}`);

  if (!res.success) {
    return null;
  }

  return res.data;
}

export async function searchDeals(
  query: string
): Promise<PipedriveDeal[]> {
  const encoded = encodeURIComponent(query);
  const res = await searchRequest<PipedriveDeal>(
    `/deals/search?term=${encoded}&limit=5`
  );

  if (!res.success || !res.data?.items) {
    return [];
  }

  return res.data.items.map((entry) => entry.item);
}

// ── Persons ──

export async function createPerson(
  data: CreatePersonPayload
): Promise<PipedrivePerson> {
  const res = await request<PipedrivePerson>("/persons", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.success || !res.data) {
    throw new Error(
      `Failed to create person: ${res.error ?? "unknown error"}`
    );
  }

  return res.data;
}

/** Search persons by email and return the first match. */
export async function findPersonByEmail(
  email: string
): Promise<PipedrivePerson | null> {
  const encoded = encodeURIComponent(email);
  const res = await searchRequest<PipedrivePerson>(
    `/persons/search?term=${encoded}&fields=email&limit=1`
  );

  if (!res.success || !res.data?.items?.length) {
    return null;
  }

  return res.data.items[0].item;
}

// ── Organizations ──

export async function createOrganization(
  data: CreateOrganizationPayload
): Promise<PipedriveOrganization> {
  const res = await request<PipedriveOrganization>("/organizations", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.success || !res.data) {
    throw new Error(
      `Failed to create organization: ${res.error ?? "unknown error"}`
    );
  }

  return res.data;
}
