"use client";

import type { Proposal } from "@/lib/types";
import { getSelectedSections } from "@/lib/proposal-helpers";

interface ProposalTocProps {
  proposal: Proposal;
}

export function ProposalToc({ proposal }: ProposalTocProps) {
  const sections = getSelectedSections(proposal);

  // Build TOC entries with computed page numbers
  // Page 1 = Cover, Page 2 = TOC, then scope pages, then payment, notes, thank you
  const entries: { label: string; page: number }[] = [];
  let page = 3; // scope starts on page 3

  for (const section of sections) {
    entries.push({ label: section.label, page });
    page++;
  }

  const paymentPage = page;
  entries.push({ label: "Allowances & Payment Schedule", page: paymentPage });
  page++;

  entries.push({ label: "General Notes & Conditions", page });
  page++;

  entries.push({ label: "Thank You", page });

  return (
    <section className="proposal-page flex flex-col bg-white px-16 py-16">
      <h2
        className="mb-10 text-center text-2xl font-bold tracking-[0.15em] uppercase"
        style={{ color: "#0f1d2c" }}
      >
        Table of Contents
      </h2>

      <div className="mx-auto w-full max-w-lg space-y-0">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="flex items-end justify-between border-b border-gray-200 py-3"
          >
            <span
              className="text-sm font-medium"
              style={{ color: "#0f1d2c" }}
            >
              {entry.label}
            </span>
            <span className="ml-4 shrink-0 text-sm text-gray-400">
              {String(entry.page).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
