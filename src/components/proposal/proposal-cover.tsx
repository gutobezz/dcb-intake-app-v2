"use client";

import type { Proposal } from "@/lib/types";
import {
  clientName,
  formatPrice,
  getSelectedSections,
  proposalDate,
} from "@/lib/proposal-helpers";

interface ProposalCoverProps {
  proposal: Proposal;
}

export function ProposalCover({ proposal }: ProposalCoverProps) {
  const name = clientName(proposal);
  const sections = getSelectedSections(proposal);
  const price = formatPrice(proposal.projectPrice);
  const date = proposal.desiredStartDate || proposalDate();

  return (
    <section
      className="proposal-page flex flex-col justify-between"
      style={{ backgroundColor: "#0f1d2c", color: "#ffffff" }}
    >
      {/* Top — Logo & Title */}
      <div className="flex flex-col items-center pt-16">
        {/* Logo text */}
        <div className="mb-2 text-center">
          <div
            className="text-5xl font-bold tracking-[0.25em]"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            D&amp;C
          </div>
          <div
            className="mt-1 text-lg tracking-[0.45em] uppercase"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            Builders
          </div>
          <div
            className="mt-1 text-[10px] tracking-[0.2em] uppercase opacity-60"
          >
            Design &amp; Create
          </div>
        </div>

        <div className="mx-auto my-6 h-px w-24 bg-white/30" />

        <h1
          className="text-center text-2xl font-light tracking-[0.3em] uppercase"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          Project Proposal
        </h1>
      </div>

      {/* Center — Client & Scope */}
      <div className="flex flex-1 flex-col items-center justify-center px-12">
        <h2
          className="mb-2 text-center text-4xl font-bold"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {name || "Client Name"}
        </h2>
        {proposal.address && (
          <p className="mb-8 text-center text-base opacity-70">
            {proposal.address}
          </p>
        )}

        {/* Scope list */}
        {sections.length > 0 && (
          <div className="mb-8 w-full max-w-md">
            <h3 className="mb-3 text-center text-xs font-medium tracking-[0.2em] uppercase opacity-50">
              Scope of Work
            </h3>
            <ul className="space-y-1.5 text-center">
              {sections.map((s) => (
                <li key={s.id} className="text-sm opacity-80">
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price */}
        <div className="text-center">
          <div className="text-4xl font-bold tracking-wide">{price}</div>
        </div>
      </div>

      {/* Bottom — Date & License */}
      <div className="flex flex-col items-center pb-12">
        <p className="text-sm opacity-60">{date}</p>
        <p className="mt-1 text-[10px] opacity-40">
          CSLB License #1116111
        </p>
      </div>
    </section>
  );
}
