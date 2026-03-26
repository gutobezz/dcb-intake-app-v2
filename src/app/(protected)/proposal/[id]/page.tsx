import { createClient } from "@/lib/supabase/server";
import { ProposalPreview } from "@/components/proposal/proposal-preview";
import { INITIAL_PROPOSAL, type Proposal, type DbProposal } from "@/lib/types";
import { dbToProposal } from "@/lib/proposal-helpers";
import { notFound } from "next/navigation";

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
