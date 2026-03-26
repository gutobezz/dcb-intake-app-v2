"use client";

import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LeadScoreBadge } from "@/components/shared/lead-score-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  User,
  Home,
  ClipboardList,
  DollarSign,
  StickyNote,
  FileText,
  Send,
  BookMarked,
  CheckCircle2,
  Eye,
  Download,
  Loader2,
} from "lucide-react";
import { PROJECT_TYPES, type LeadScore } from "@/lib/types";
import type { ProposalFormReturn } from "@/hooks/use-proposal-form";
import { clientName as buildClientName } from "@/lib/proposal-helpers";

interface TabReviewProps {
  form: ProposalFormReturn;
  onSaveToLibrary: () => Promise<void>;
  savingToLibrary: boolean;
}

function formatPrice(raw: string): string {
  if (!raw) return "--";
  const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return raw;
  return `$${num.toLocaleString("en-US")}`;
}

export function TabReview({ form, onSaveToLibrary, savingToLibrary }: TabReviewProps) {
  const { state } = form;
  const name = [state.firstName, state.lastName].filter(Boolean).join(" ");
  const canGenerate = name.length > 0 && state.projectPrice.length > 0;
  const [downloading, setDownloading] = useState(false);

  const handlePreview = useCallback(() => {
    // Encode proposal state as URL-safe JSON and open in new tab
    const encoded = encodeURIComponent(JSON.stringify(state));
    window.open(`/proposal/preview?data=${encoded}`, "_blank");
  }, [state]);

  const handleDownloadPdf = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalData: state }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "PDF generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DCB_Proposal_${buildClientName(state).replace(/\s+/g, "_") || "Draft"}.pdf`;
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
  }, [state]);

  // Resolve selected project types
  const selectedTypes = PROJECT_TYPES.filter((pt) =>
    state.projectTypes.includes(pt.id)
  );

  // Count selected scope items
  const selectedScopeCount = Object.values(state.scopeItems).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {name || "New Proposal"}
          </h2>
          {state.address && (
            <p className="text-sm text-muted-foreground">{state.address}</p>
          )}
        </div>
        <StatusBadge status={state.status} />
      </div>

      <Separator />

      {/* Client Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="size-4" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm md:grid-cols-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{name || "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{state.email || "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{state.phone || "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Referral</span>
              <span className="font-medium">
                {state.referralSource || "--"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Advisor</span>
              <span className="font-medium">{state.advisor || "--"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Home className="size-4" />
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm md:grid-cols-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium">{state.address || "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">
                {state.propertyType || "--"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Year Built</span>
              <span className="font-medium">{state.yearBuilt || "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sq Ft</span>
              <span className="font-medium">{state.sqft || "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bed / Bath</span>
              <span className="font-medium">
                {state.bedrooms || "--"} / {state.bathrooms || "--"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stories</span>
              <span className="font-medium">{state.stories || "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">HOA</span>
              <span className="font-medium">{state.hoa ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Has Plans</span>
              <span className="font-medium">
                {state.hasPlans ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Scope */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ClipboardList className="size-4" />
            Selected Scope
            {selectedScopeCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {selectedScopeCount} items
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTypes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No project types selected.
            </p>
          ) : (
            <div className="space-y-4">
              {selectedTypes.map((pt) => {
                const checkedItems = pt.items.filter(
                  (item) => state.scopeItems[`${pt.id}::${item.id}`]
                );
                return (
                  <div key={pt.id}>
                    <h4 className="mb-1 text-sm font-medium">{pt.label}</h4>
                    {checkedItems.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No items selected
                      </p>
                    ) : (
                      <ul className="ml-4 list-disc space-y-0.5">
                        {checkedItems.map((item) => (
                          <li
                            key={item.id}
                            className="text-xs text-muted-foreground"
                          >
                            {item.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <DollarSign className="size-4" />
            Pricing & Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm md:grid-cols-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project Price</span>
                <span className="text-base font-semibold">
                  {formatPrice(state.projectPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Financing</span>
                <span className="font-medium">
                  {state.financing || "--"}
                </span>
              </div>
            </div>

            {state.allowances.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Allowances
                  </h4>
                  <div className="space-y-1">
                    {state.allowances.map((a, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm"
                      >
                        <span>{a.description || "Untitled"}</span>
                        <span className="font-medium">
                          {formatPrice(a.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {state.paymentSchedule.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Payment Schedule
                  </h4>
                  <div className="space-y-1">
                    {state.paymentSchedule.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{p.milestone || "Untitled"}</span>
                        <div className="flex items-center gap-3">
                          {p.percentage && (
                            <Badge variant="secondary" className="text-[10px]">
                              {p.percentage}%
                            </Badge>
                          )}
                          <span className="font-medium">
                            {formatPrice(p.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Internal Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <StickyNote className="size-4" />
            Internal Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {state.leadScore && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Lead Score:</span>
                <LeadScoreBadge score={state.leadScore as LeadScore} />
              </div>
            )}
            {state.salespersons.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Team:</span>
                <span>{state.salespersons.join(", ")}</span>
              </div>
            )}
            {state.priorities.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Priorities:</span>
                <div className="flex flex-wrap gap-1">
                  {state.priorities.map((p) => (
                    <Badge key={p} variant="outline" className="text-[10px]">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {state.followUp && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Follow-up:</span>
                <span>{state.followUpDays} days</span>
              </div>
            )}
            {state.additionalNotes && (
              <div>
                <span className="text-muted-foreground">Notes:</span>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground/80">
                  {state.additionalNotes}
                </p>
              </div>
            )}
            {state.notesTags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {state.notesTags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {!state.leadScore &&
              state.salespersons.length === 0 &&
              state.priorities.length === 0 &&
              !state.additionalNotes && (
                <p className="text-muted-foreground">No internal notes yet.</p>
              )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          size="lg"
          variant="outline"
          className="flex-1 gap-2"
          disabled={!canGenerate}
          onClick={handlePreview}
        >
          <Eye className="size-4" />
          Preview Proposal
        </Button>
        <Button
          size="lg"
          className="flex-1 gap-2"
          disabled={!canGenerate || downloading}
          onClick={handleDownloadPdf}
        >
          {downloading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          {downloading ? "Generating..." : "Generate Proposal"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1 gap-2"
          disabled={savingToLibrary}
          onClick={onSaveToLibrary}
        >
          {savingToLibrary ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <BookMarked className="size-4" />
          )}
          {savingToLibrary ? "Saving..." : "Save to Library"}
        </Button>
        <Button variant="outline" size="lg" className="flex-1 gap-2">
          <Send className="size-4" />
          Send Contract via DocuSign
        </Button>
      </div>

      {!canGenerate && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5" />
          <span>
            Enter a client name and project price to generate a proposal.
          </span>
        </div>
      )}
    </div>
  );
}
