"use client";

import { DEFAULT_GENERAL_NOTES } from "@/lib/constants/general-notes";
import type { Proposal } from "@/lib/types";

interface ProposalNotesProps {
  proposal: Proposal;
  pageNumber: number;
}

export function ProposalNotes({ proposal, pageNumber }: ProposalNotesProps) {
  const notes =
    proposal.generalNotes.length > 0
      ? proposal.generalNotes
      : DEFAULT_GENERAL_NOTES;

  return (
    <section className="proposal-page flex flex-col bg-white">
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-12 py-4"
        style={{ backgroundColor: "#0f1d2c" }}
      >
        <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
          D&amp;C Builders
        </span>
        <span className="text-xs text-white/60">
          Page {String(pageNumber).padStart(2, "0")}
        </span>
      </div>

      <div className="flex-1 px-12 py-8">
        <h2
          className="mb-6 text-xl font-bold tracking-wide uppercase"
          style={{ color: "#0f1d2c" }}
        >
          General Notes &amp; Conditions
        </h2>

        <ol className="list-decimal space-y-2 pl-5">
          {notes.map((note, i) => (
            <li
              key={i}
              className="text-[10px] leading-relaxed text-gray-600"
              style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
            >
              {note}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
