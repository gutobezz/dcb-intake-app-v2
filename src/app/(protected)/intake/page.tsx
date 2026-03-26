import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IntakeForm } from "@/components/intake/intake-form";
import { dbToProposal } from "@/lib/proposal-helpers";
import type { DbProposal } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function IntakePage({ searchParams }: PageProps) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="py-8">
        <IntakeForm />
      </div>
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    // Invalid or inaccessible ID — fall back to blank form
    return (
      <div className="py-8">
        <IntakeForm />
      </div>
    );
  }

  const initialData = dbToProposal(data as DbProposal);

  return (
    <div className="py-8">
      <IntakeForm initialData={initialData} proposalId={id} />
    </div>
  );
}
