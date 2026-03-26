import {
  INITIAL_PROPOSAL,
  PROJECT_TYPES,
  type DbProposal,
  type Proposal,
  type CreateDbProposalInput,
  type UpdateDbProposalInput,
} from "@/lib/types";

/** Convert DB snake_case proposal row to client-side camelCase Proposal */
export function dbToProposal(db: DbProposal): Proposal {
  return {
    id: db.id,
    status: db.status,
    firstName: db.first_name,
    lastName: db.last_name,
    email: db.email,
    phone: db.phone,
    referralSource: db.referral_source as Proposal["referralSource"],
    advisor: (db.salespersons?.[0] ?? "") as Proposal["advisor"],
    additionalOwners: (() => {
      try { return JSON.parse(db.scope_notes?._meta_owners ?? "[]"); } catch { return []; }
    })(),
    address: db.address,
    propertyType: db.property_type as Proposal["propertyType"],
    yearBuilt: db.year_built != null ? String(db.year_built) : "",
    sqft: db.sqft != null ? String(db.sqft) : "",
    bedrooms: db.bedrooms != null ? String(db.bedrooms) : "",
    bathrooms: db.bathrooms != null ? String(db.bathrooms) : "",
    stories: db.stories,
    hoa: db.hoa,
    hasPlans: db.has_plans,
    rti: db.scope_notes?._meta_rti === "true",
    lotSize: db.scope_notes?._meta_lot_size ?? "",
    estimatedValue: db.scope_notes?._meta_est_value ?? "",
    lastSoldPrice: db.scope_notes?._meta_last_sold ?? "",
    conditionNotes: db.scope_notes?._meta_cond_notes ?? "",
    projectTypes: db.project_types ?? [],
    scopeItems: db.scope_items ?? {},
    scopeNotes: db.scope_notes ?? {},
    descOverrides: db.desc_overrides ?? {},
    finishSelections: db.finish_selections ?? {},
    scopeCounts: db.scope_counts ?? {},
    projectPrice: db.project_price ?? "",
    downPayment: db.scope_notes?._meta_down_payment ?? "",
    budgetRange: db.budget_range ?? "",
    timeline: "",
    desiredStartDate: "",
    startDate: db.scope_notes?._meta_start_date ?? "",
    completionDate: db.scope_notes?._meta_completion_date ?? "",
    financing: db.financing as Proposal["financing"],
    allowances: db.allowances ?? [],
    paymentSchedule: db.payment_schedule?.length
      ? db.payment_schedule
      : INITIAL_PROPOSAL.paymentSchedule,
    salespersons: db.salespersons ?? [],
    leadScore: db.lead_score as Proposal["leadScore"],
    followUp: db.follow_up ?? false,
    followUpDays: String(db.follow_up_days ?? 7),
    priorities: db.priorities ?? [],
    additionalNotes: db.additional_notes ?? "",
    notesTags: db.notes_tags ?? [],
    designPageSections: db.design_page_sections ?? [],
    generalNotes: db.general_notes ?? [],
    showToc: db.show_toc ?? true,
  };
}

/** Resolve the selected scope sections from proposal state */
export function getSelectedSections(proposal: Proposal) {
  return PROJECT_TYPES.filter((pt) =>
    proposal.projectTypes.includes(pt.id)
  ).map((pt) => ({
    ...pt,
    checkedItems: pt.items.filter(
      (item) => proposal.scopeItems[`${pt.id}::${item.id}`]
    ),
  }));
}

/** Format a raw price string to $X,XXX */
export function formatPrice(raw: string): string {
  if (!raw) return "--";
  const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return raw;
  return `$${num.toLocaleString("en-US")}`;
}

/** Get today's date formatted as "Month YYYY" */
export function proposalDate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/** Build full client name */
export function clientName(proposal: Proposal): string {
  return [proposal.firstName, proposal.lastName].filter(Boolean).join(" ");
}

/** Map form state (camelCase) to DB input (snake_case) for create */
export function proposalToDbInput(proposal: Proposal): CreateDbProposalInput {
  return {
    advisor_id: "",
    status: proposal.status,

    first_name: proposal.firstName,
    last_name: proposal.lastName,
    email: proposal.email,
    phone: proposal.phone,
    referral_source: proposal.referralSource,

    address: proposal.address,
    property_type: proposal.propertyType,
    year_built: proposal.yearBuilt ? parseInt(proposal.yearBuilt, 10) : null,
    sqft: proposal.sqft ? parseInt(proposal.sqft, 10) : null,
    bedrooms: proposal.bedrooms ? parseInt(proposal.bedrooms, 10) : null,
    bathrooms: proposal.bathrooms ? parseInt(proposal.bathrooms, 10) : null,
    stories: proposal.stories,
    hoa: proposal.hoa,
    has_plans: proposal.hasPlans,

    project_types: proposal.projectTypes,
    scope_items: proposal.scopeItems,
    scope_notes: {
      ...proposal.scopeNotes,
      // Store extra form fields (no dedicated DB columns) with _meta_ prefix
      _meta_owners: JSON.stringify(proposal.additionalOwners),
      _meta_rti: proposal.rti ? "true" : "false",
      _meta_lot_size: proposal.lotSize,
      _meta_est_value: proposal.estimatedValue,
      _meta_last_sold: proposal.lastSoldPrice,
      _meta_cond_notes: proposal.conditionNotes,
      _meta_down_payment: proposal.downPayment,
      _meta_start_date: proposal.startDate,
      _meta_completion_date: proposal.completionDate,
    },
    desc_overrides: proposal.descOverrides,
    finish_selections: proposal.finishSelections,
    scope_counts: proposal.scopeCounts,

    project_price: proposal.projectPrice,
    budget_range: proposal.budgetRange,
    financing: proposal.financing,
    allowances: proposal.allowances,
    payment_schedule: proposal.paymentSchedule,

    lead_score: proposal.leadScore,
    salespersons: proposal.salespersons,
    follow_up: proposal.followUp,
    follow_up_days: parseInt(proposal.followUpDays, 10) || 7,
    priorities: proposal.priorities,
    additional_notes: proposal.additionalNotes,
    notes_tags: proposal.notesTags,

    design_page_sections: proposal.designPageSections,
    general_notes: proposal.generalNotes,
    show_toc: proposal.showToc,

    version: 1,
    revisions: [],
    docusign_envelope_id: null,
    contract_signed_at: null,
  };
}

/** Map form state to a partial DB update (omit version/revisions/contracts) */
export function proposalToDbUpdate(proposal: Proposal): UpdateDbProposalInput {
  const full = proposalToDbInput(proposal);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { version, revisions, docusign_envelope_id, contract_signed_at, advisor_id, ...rest } = full;
  return rest;
}
