import { Library } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PipelineView } from "@/components/library/pipeline-view";
import type { DbProposal } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: proposals, error } = await supabase
    .from("proposals")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-dcb-gold/10">
            <Library className="size-5 text-dcb-gold" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Pipeline</h1>
            <p className="text-sm text-muted-foreground">
              Track and manage all proposals in your sales pipeline
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">
            Failed to load proposals: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const typedProposals = (proposals ?? []) as DbProposal[];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-dcb-gold/10">
          <Library className="size-5 text-dcb-gold" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Pipeline</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage all proposals in your sales pipeline
          </p>
        </div>
      </div>

      <PipelineView proposals={typedProposals} />
    </div>
  );
}
