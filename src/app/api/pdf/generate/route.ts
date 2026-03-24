import { renderToStream, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { INITIAL_PROPOSAL, type Proposal, type DbProposal } from "@/lib/types";
import { ProposalDocument } from "@/lib/pdf/proposal-document";
import { createElement } from "react";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let proposal: Proposal;

    if (body.proposalId) {
      // Fetch from Supabase
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", body.proposalId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "Proposal not found" },
          { status: 404 }
        );
      }

      proposal = dbToProposal(data as DbProposal);
    } else if (body.proposalData) {
      proposal = { ...INITIAL_PROPOSAL, ...body.proposalData };
    } else {
      return NextResponse.json(
        { error: "Provide proposalId or proposalData" },
        { status: 400 }
      );
    }

    // Render PDF using react-pdf
    const element = createElement(ProposalDocument, { proposal }) as unknown as ReactElement<DocumentProps>;
    const stream = await renderToStream(element);

    // Convert Node.js readable stream to a web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        stream.on("end", () => {
          controller.close();
        });
        stream.on("error", (err: Error) => {
          controller.error(err);
        });
      },
    });

    const clientName = [proposal.firstName, proposal.lastName]
      .filter(Boolean)
      .join("_") || "Draft";

    return new Response(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="DCB_Proposal_${clientName}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "PDF generation failed" },
      { status: 500 }
    );
  }
}
