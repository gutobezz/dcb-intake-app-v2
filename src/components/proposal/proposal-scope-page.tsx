"use client";

import type { Proposal, ScopeItemDef } from "@/lib/types";

interface ProposalScopePageProps {
  proposal: Proposal;
  sectionId: string;
  sectionLabel: string;
  items: ScopeItemDef[];
  pageNumber: number;
}

export function ProposalScopePage({
  proposal,
  sectionId,
  sectionLabel,
  items,
  pageNumber,
}: ProposalScopePageProps) {
  // Filter to only checked items
  const checkedItems = items.filter(
    (item) => proposal.scopeItems[`${sectionId}::${item.id}`]
  );

  if (checkedItems.length === 0) return null;

  return (
    <section className="proposal-page flex flex-col bg-white">
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-12 py-4"
        style={{ backgroundColor: "#0f1d2c" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
            D&amp;C Builders
          </span>
        </div>
        <span className="text-xs text-white/60">
          Page {String(pageNumber).padStart(2, "0")}
        </span>
      </div>

      {/* Section title */}
      <div className="border-b border-gray-200 px-12 py-6">
        <h2
          className="text-xl font-bold tracking-wide uppercase"
          style={{ color: "#0f1d2c" }}
        >
          {sectionLabel}
        </h2>
      </div>

      {/* Scope items */}
      <div className="flex-1 px-12 py-6">
        <div className="space-y-5">
          {checkedItems.map((item) => {
            const overrideKey = `${sectionId}::${item.id}`;
            const description =
              proposal.descOverrides[overrideKey] || item.description;
            const note = proposal.scopeNotes[overrideKey];

            return (
              <div
                key={item.id}
                className="scope-item"
                style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-sm"
                    style={{ backgroundColor: "#0f1d2c" }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4
                      className="text-sm font-semibold"
                      style={{ color: "#0f1d2c" }}
                    >
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      {description}
                    </p>
                    {note && (
                      <p className="mt-1 text-xs italic text-gray-400">
                        Note: {note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
