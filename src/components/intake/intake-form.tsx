"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProposalForm } from "@/hooks/use-proposal-form";
import { useAutosave } from "@/hooks/use-autosave";
import { TabClient } from "./tab-client";
import { TabProperty } from "./tab-property";
import { TabScope } from "./tab-scope";
import { TabDetails } from "./tab-details";
import { TabReview } from "./tab-review";
import { TabLibrary } from "./tab-library";
import { TabChangeOrder } from "./tab-change-order";
import type { Proposal } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";

const TAB_IDS = ["client", "property", "scope", "details", "review", "library", "change-order"] as const;

const TAB_CONFIG = [
  { id: "client" as const, label: "Client", emoji: "\u{1F464}" },
  { id: "property" as const, label: "Property", emoji: "\u{1F4CD}" },
  { id: "scope" as const, label: "Scope", emoji: "\u{1F4E6}" },
  { id: "details" as const, label: "Details", emoji: "\u{1F4DD}" },
  { id: "review" as const, label: "Review", emoji: "\u2705" },
  { id: "library" as const, label: "Library", emoji: "\u{1F4DA}" },
  { id: "change-order" as const, label: "Change Order", emoji: "\u{1F4CB}" },
];

interface IntakeFormProps {
  initialData?: Partial<Proposal>;
  proposalId?: string;
}

export function IntakeForm({ initialData, proposalId }: IntakeFormProps) {
  const form = useProposalForm(initialData);
  const { isSaving, lastSaved } = useAutosave(form.state, proposalId);
  const [activeTab, setActiveTab] = useState(0);

  // Count selected scope items
  const scopeCount = useMemo(() => {
    return Object.values(form.state.scopeItems).filter(Boolean).length;
  }, [form.state.scopeItems]);

  const currentTabId = TAB_IDS[activeTab];
  const isFirst = activeTab === 0;
  const isLast = activeTab === TAB_IDS.length - 1;

  function goNext() {
    if (!isLast) setActiveTab((t) => t + 1);
  }

  function goPrev() {
    if (!isFirst) setActiveTab((t) => t - 1);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Top bar with auto-save indicator */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Client Intake</h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isSaving ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="size-3 text-green-500" />
              <span>
                Saved{" "}
                {lastSaved.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          ) : (
            <span>Not saved yet</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as number)}
      >
        <TabsList variant="line" className="w-full justify-start gap-0 overflow-x-auto">
          {TAB_CONFIG.map((tab, index) => (
            <TabsTrigger
              key={tab.id}
              value={index}
              className="gap-1 px-2.5 text-xs sm:gap-1.5 sm:px-3 sm:text-sm"
            >
              <span className="text-base leading-none">{tab.emoji}</span>
              <span className="hidden sm:inline">
                {tab.label}
                {tab.id === "scope" && scopeCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 h-4 min-w-[18px] bg-amber-500/20 px-1 text-[10px] text-amber-400"
                  >
                    {scopeCount}
                  </Badge>
                )}
              </span>
              {/* Mobile: show scope count after emoji */}
              {tab.id === "scope" && scopeCount > 0 && (
                <Badge
                  variant="secondary"
                  className="h-4 min-w-[18px] bg-amber-500/20 px-1 text-[10px] text-amber-400 sm:hidden"
                >
                  {scopeCount}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value={0}>
            <TabClient form={form} />
          </TabsContent>
          <TabsContent value={1}>
            <TabProperty form={form} />
          </TabsContent>
          <TabsContent value={2}>
            <TabScope form={form} />
          </TabsContent>
          <TabsContent value={3}>
            <TabDetails form={form} />
          </TabsContent>
          <TabsContent value={4}>
            <TabReview form={form} />
          </TabsContent>
          <TabsContent value={5}>
            <TabLibrary />
          </TabsContent>
          <TabsContent value={6}>
            <TabChangeOrder />
          </TabsContent>
        </div>
      </Tabs>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between border-t border-border/50 pt-4">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={isFirst}
          className="gap-1.5"
        >
          <ChevronLeft className="size-3.5" />
          Previous
        </Button>

        <div className="flex items-center gap-1.5">
          {TAB_IDS.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`size-2 rounded-full transition-colors ${
                index === activeTab
                  ? "bg-primary"
                  : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        <Button
          variant={isLast ? "default" : "outline"}
          onClick={goNext}
          disabled={isLast}
          className="gap-1.5"
        >
          Next
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
