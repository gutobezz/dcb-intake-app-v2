"use client";

import { useCallback, useState } from "react";
import type { Proposal } from "@/lib/types";
import { getSelectedSections, clientName } from "@/lib/proposal-helpers";
import { ProposalCover } from "./proposal-cover";
import { ProposalToc } from "./proposal-toc";
import { ProposalScopePage } from "./proposal-scope-page";
import { ProposalPayment } from "./proposal-payment";
import { ProposalNotes } from "./proposal-notes";
import { ProposalThankYou } from "./proposal-thankyou";

interface ProposalPreviewProps {
  proposal: Proposal;
}

const FONT_SCALES = {
  S: 0.85,
  M: 1,
  L: 1.15,
} as const;

type FontScale = keyof typeof FONT_SCALES;

export function ProposalPreview({ proposal }: ProposalPreviewProps) {
  const [fontScale, setFontScale] = useState<FontScale>("M");
  const [showToc, setShowToc] = useState(proposal.showToc);
  const [downloading, setDownloading] = useState(false);

  const sections = getSelectedSections(proposal);

  // Compute page numbers
  let pageNum = 2; // 1 = cover
  if (showToc) pageNum++; // TOC takes a page
  const scopeStartPage = pageNum;

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalData: { ...proposal, showToc } }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "PDF generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DCB_Proposal_${clientName(proposal).replace(/\s+/g, "_") || "Draft"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
      alert(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  }, [proposal, showToc]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar — hidden during print */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white px-4 py-3 shadow-sm print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-sm font-semibold text-gray-800">
            Proposal Preview
          </h1>

          <div className="flex items-center gap-4">
            {/* Font scale */}
            <div className="flex items-center gap-1">
              <span className="mr-1 text-xs text-gray-500">Font:</span>
              {(Object.keys(FONT_SCALES) as FontScale[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setFontScale(key)}
                  className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                    fontScale === key
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* TOC toggle */}
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={showToc}
                onChange={(e) => setShowToc(e.target.checked)}
                className="size-3.5 rounded border-gray-300"
              />
              TOC
            </label>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Print
            </button>

            {/* Download PDF */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="rounded-md bg-gray-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {downloading ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </div>

      {/* Proposal pages */}
      <div
        className="proposal-container mx-auto max-w-4xl py-8 print:max-w-none print:py-0"
        style={{ fontSize: `${FONT_SCALES[fontScale]}rem` }}
      >
        {/* Cover */}
        <ProposalCover proposal={proposal} />

        {/* TOC */}
        {showToc && <ProposalToc proposal={proposal} />}

        {/* Scope pages */}
        {sections.map((section, i) => (
          <ProposalScopePage
            key={section.id}
            proposal={proposal}
            sectionId={section.id}
            sectionLabel={section.label}
            items={section.items}
            pageNumber={scopeStartPage + i}
          />
        ))}

        {/* Payment */}
        <ProposalPayment
          proposal={proposal}
          pageNumber={scopeStartPage + sections.length}
        />

        {/* Notes */}
        <ProposalNotes
          proposal={proposal}
          pageNumber={scopeStartPage + sections.length + 1}
        />

        {/* Thank You */}
        <ProposalThankYou />
      </div>

      {/* Print / proposal page styles */}
      <style>{`
        .proposal-page {
          width: 8.5in;
          min-height: 11in;
          margin: 0 auto 2rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        @media print {
          body { margin: 0; padding: 0; }
          .proposal-page {
            width: 100%;
            min-height: 100vh;
            margin: 0;
            box-shadow: none;
            page-break-after: always;
          }
          .proposal-page:last-child {
            page-break-after: auto;
          }
          @page {
            size: letter;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
