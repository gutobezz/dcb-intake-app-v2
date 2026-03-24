import { createClient } from "@/lib/supabase/server";
import { ProposalPreview } from "@/components/proposal/proposal-preview";
import { INITIAL_PROPOSAL, type Proposal, type DbProposal } from "@/lib/types";
import { notFound } from "next/navigation";

/** Convert DB snake_case proposal to client-side camelCase Proposal */
function dbToProposal(db: DbProposal): Proposal {
  return {
    id: db.id,
    status: db.status,
    firstName: db.client_first_name,
    lastName: db.client_last_name,
    email: db.client_email,
    phone: db.client_phone,
    referralSource: db.referral_source as Proposal["referralSource"],
    advisor: "" as Proposal["advisor"],
    address: db.address,
    propertyType: db.property_type as Proposal["propertyType"],
    yearBuilt: db.year_built != null ? String(db.year_built) : "",
    sqft: db.sqft != null ? String(db.sqft) : "",
    bedrooms: db.bedrooms != null ? String(db.bedrooms) : "",
    bathrooms: db.bathrooms != null ? String(db.bathrooms) : "",
    stories: db.stories,
    hoa: db.hoa,
    hasPlans: db.has_plans,
    projectTypes: db.project_types,
    scopeItems: db.scope_items,
    scopeNotes: db.scope_notes,
    descOverrides: db.desc_overrides,
    finishSelections: db.finish_selections,
    scopeCounts: db.scope_counts,
    projectPrice: db.project_price,
    budgetRange: db.budget_range,
    timeline: "",
    desiredStartDate: "",
    financing: db.financing as Proposal["financing"],
    allowances: db.allowances,
    paymentSchedule: db.payment_schedule,
    salespersons: db.salespersons,
    leadScore: db.lead_score as Proposal["leadScore"],
    followUp: db.follow_up,
    followUpDays: String(db.follow_up_days),
    priorities: db.priorities,
    additionalNotes: db.additional_notes,
    notesTags: db.notes_tags,
    designPageSections: db.design_page_sections,
    generalNotes: db.general_notes,
    showToc: db.show_toc,
  };
}

export default async function ProposalPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;

  // If ID is "preview", try to load proposal data from search params
  if (id === "preview") {
    const dataParam = typeof query.data === "string" ? query.data : null;
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam)) as Partial<Proposal>;
        const proposal: Proposal = { ...INITIAL_PROPOSAL, ...parsed };
        return <ProposalPreview proposal={proposal} />;
      } catch {
        notFound();
      }
    }
    // Fallback: render with empty initial proposal (useful for testing)
    return <ProposalPreview proposal={{ ...INITIAL_PROPOSAL }} />;
  }

  // Fetch from Supabase
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const proposal = dbToProposal(data as DbProposal);
  return <ProposalPreview proposal={proposal} />;
}
