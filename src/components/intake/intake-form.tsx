"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { createProposal, updateProposal } from "@/lib/actions/proposals";
import { proposalToDbInput, proposalToDbUpdate } from "@/lib/proposal-helpers";
import type { Proposal } from "@/lib/types";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  UserRound,
  MapPin,
  Layers,
  SlidersHorizontal,
  ClipboardCheck,
  BookMarked,
  GitPullRequestArrow,
  type LucideIcon,
} from "lucide-react";

const TAB_IDS = ["client", "property", "scope", "details", "review", "library", "change-order"] as const;

const TAB_CONFIG: { id: typeof TAB_IDS[number]; label: string; icon: LucideIcon }[] = [
  { id: "client",       label: "Client",       icon: UserRound },
  { id: "property",     label: "Property",     icon: MapPin },
  { id: "scope",        label: "Scope",        icon: Layers },
  { id: "details",      label: "Details",      icon: SlidersHorizontal },
  { id: "review",       label: "Review",       icon: ClipboardCheck },
  { id: "library",      label: "Library",      icon: BookMarked },
  { id: "change-order", label: "Change Order", icon: GitPullRequestArrow },
];

interface IntakeFormProps {
  initialData?: Partial<Proposal>;
  proposalId?: string;
}

export function IntakeForm({ initialData, proposalId }: IntakeFormProps) {
  const router = useRouter();
  const form = useProposalForm(initialData);
  const savedIdRef = useRef<string | undefined>(proposalId);
  const [savingToLibrary, setSavingToLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleSave = useCallback(async (data: Proposal) => {
    if (savedIdRef.current) {
      const result = await updateProposal(savedIdRef.current, proposalToDbUpdate(data));
      if (result.error) throw new Error(result.error);
    } else {
      const result = await createProposal(proposalToDbInput(data));
      if (result.error) throw new Error(result.error);
      if (result.data) {
        savedIdRef.current = result.data.id;
        window.history.replaceState(null, "", `/intake?id=${result.data.id}`);
      }
    }
  }, []);

  const { isSaving, lastSaved, saveNow } = useAutosave(form.state, handleSave);

  const handleSaveToLibrary = useCallback(async () => {
    setSavingToLibrary(true);
    try {
      await saveNow(form.state);
      toast.success("Saved to Library");
      router.push("/library");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSavingToLibrary(false);
    }
  }, [saveNow, form.state, router]);

  // Count selected scope items
  const scopeCount = useMemo(() => {
    return Object.values(form.state.scopeItems).filter(Boolean).length;
  }, [form.state.scopeItems]);

  const currentTabId = TAB_IDS[activeTab];
  const isFirst = activeTab === 0;
  const isLast = activeTab === TAB_IDS.length - 1;

  function navigateTo(index: number) {
    saveNow(form.state);
    setActiveTab(index);
  }

  function goNext() {
    if (!isLast) navigateTo(activeTab + 1);
  }

  function goPrev() {
    if (!isFirst) navigateTo(activeTab - 1);
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
        onValueChange={(val) => navigateTo(val as number)}
      >
        <TabsList variant="line" className="w-full justify-start gap-0 overflow-x-auto">
          {TAB_CONFIG.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={index}
                className="gap-1.5 px-2.5 text-xs sm:px-3 sm:text-sm"
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="hidden sm:inline">
                  {tab.label}
                  {tab.id === "scope" && scopeCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1.5 h-4 min-w-[18px] bg-primary/20 px-1 text-[10px] text-primary"
                    >
                      {scopeCount}
                    </Badge>
                  )}
                </span>
                {/* Mobile: show scope count after icon */}
                {tab.id === "scope" && scopeCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-4 min-w-[18px] bg-primary/20 px-1 text-[10px] text-primary sm:hidden"
                  >
                    {scopeCount}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
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
            <TabReview form={form} onSaveToLibrary={handleSaveToLibrary} savingToLibrary={savingToLibrary} />
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
              onClick={() => navigateTo(index)}
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
