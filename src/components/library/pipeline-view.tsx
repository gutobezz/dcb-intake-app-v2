"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PipelineStats } from "@/components/library/pipeline-stats";
import { ProposalCard } from "@/components/library/proposal-card";
import type { DbProposal, PipelineStatus } from "@/lib/types";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineViewProps {
  proposals: DbProposal[];
}

type StatusFilter = "all" | PipelineStatus;

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "sent", label: "Sent" },
  { value: "follow_up", label: "Follow Up" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const statusTabColors: Record<StatusFilter, string> = {
  all: "bg-foreground/10 text-foreground",
  active: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  sent: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  follow_up: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  won: "bg-green-500/15 text-green-400 border-green-500/30",
  lost: "bg-red-500/15 text-red-400 border-red-500/30",
};

const activeTabColors: Record<StatusFilter, string> = {
  all: "bg-foreground text-background",
  active: "bg-blue-500 text-white",
  sent: "bg-amber-500 text-white",
  follow_up: "bg-purple-500 text-white",
  won: "bg-green-500 text-white",
  lost: "bg-red-500 text-white",
};

export function PipelineView({ proposals }: PipelineViewProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      all: proposals.length,
      active: 0,
      sent: 0,
      follow_up: 0,
      won: 0,
      lost: 0,
    };
    for (const p of proposals) {
      if (p.status in counts) {
        counts[p.status as PipelineStatus]++;
      }
    }
    return counts;
  }, [proposals]);

  const filtered = useMemo(() => {
    let result = proposals;

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const name =
          `${p.client_first_name} ${p.client_last_name}`.toLowerCase();
        const address = (p.address ?? "").toLowerCase();
        const price = (p.project_price ?? "").toLowerCase();
        return name.includes(q) || address.includes(q) || price.includes(q);
      });
    }

    return result;
  }, [proposals, statusFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Stats cards */}
      <PipelineStats proposals={proposals} />

      {/* Filters bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            const count = statusCounts[tab.value];
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  isActive
                    ? activeTabColors[tab.value]
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-4 min-w-[18px] px-1 text-[10px]",
                    isActive && "bg-white/20 text-inherit"
                  )}
                >
                  {count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search client, address, or price..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Proposals list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 py-16 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {searchQuery
              ? "No proposals match your search"
              : statusFilter !== "all"
                ? `No ${statusFilter.replace("_", " ")} proposals`
                : "No proposals yet"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            {!searchQuery && statusFilter === "all"
              ? "Create a new proposal from the Intake tab to get started"
              : "Try changing filters or search term"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </div>
  );
}
