import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseRevisionRequest } from "@/lib/ai/revision-parser";
import type { DbProposal } from "@/lib/types";

export async function POST(request: Request) {
  try {
    // Validate auth
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { proposalId, messageText } = body as {
      proposalId?: string;
      messageText?: string;
    };

    if (!proposalId || typeof proposalId !== "string") {
      return NextResponse.json(
        { error: "proposalId is required" },
        { status: 400 }
      );
    }

    if (!messageText || typeof messageText !== "string" || !messageText.trim()) {
      return NextResponse.json(
        { error: "messageText is required" },
        { status: 400 }
      );
    }

    // Fetch current proposal
    const { data: proposal, error: fetchError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", proposalId)
      .single();

    if (fetchError || !proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    const dbProposal = proposal as DbProposal;

    // Build a context object with the relevant proposal fields
    const proposalContext = {
      client_name: `${dbProposal.first_name} ${dbProposal.last_name}`,
      address: dbProposal.address,
      project_price: dbProposal.project_price,
      project_types: dbProposal.project_types,
      scope_items: dbProposal.scope_items,
      allowances: dbProposal.allowances,
      payment_schedule: dbProposal.payment_schedule,
      additional_notes: dbProposal.additional_notes,
    };

    // Parse revision
    const suggestion = await parseRevisionRequest(proposalContext, messageText);

    return NextResponse.json({ suggestion });
  } catch (err) {
    console.error("[AI] Revision parsing error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Revision parsing failed",
      },
      { status: 500 }
    );
  }
}
