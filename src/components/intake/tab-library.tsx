"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PipelineView } from "@/components/library/pipeline-view";
import { PipelineStats } from "@/components/library/pipeline-stats";
import type { DbProposal } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save, Download, Upload } from "lucide-react";
import { toast } from "sonner";

export function TabLibrary() {
  const [proposals, setProposals] = useState<DbProposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProposals() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("proposals")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) {
          toast.error("Failed to load proposals: " + error.message);
          return;
        }

        setProposals((data ?? []) as DbProposal[]);
      } catch {
        toast.error("Failed to load proposals");
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, []);

  function handleExportJSON() {
    const blob = new Blob([JSON.stringify(proposals, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dcb-proposals-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Proposals exported as JSON");
  }

  function handleImportJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        toast.success(`Loaded ${Array.isArray(data) ? data.length : 0} proposals from file`);
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    input.click();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-dcb-gold" />
        <span className="ml-2 text-sm text-muted-foreground">Loading pipeline...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleExportJSON}>
          <Download className="mr-1 size-4" />
          Export JSON
        </Button>
        <Button variant="outline" size="sm" onClick={handleImportJSON}>
          <Upload className="mr-1 size-4" />
          Import JSON
        </Button>
      </div>

      {/* Pipeline view (reuses existing components) */}
      <PipelineView proposals={proposals} />
    </div>
  );
}
