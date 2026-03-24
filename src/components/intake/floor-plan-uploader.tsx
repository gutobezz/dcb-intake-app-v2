"use client";

import { useCallback, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileImage,
  Wand2,
} from "lucide-react";
import type { FloorPlanAnalysis } from "@/lib/types";
import type { ProposalFormReturn } from "@/hooks/use-proposal-form";

interface FloorPlanUploaderProps {
  form: ProposalFormReturn;
}

export function FloorPlanUploader({ form }: FloorPlanUploaderProps) {
  const [analysis, setAnalysis] = useState<FloorPlanAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setAnalysis(null);
    setFileName(file.name);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ai/floor-plan", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const applyToForm = useCallback(() => {
    if (!analysis) return;

    const { setField } = form;

    if (analysis.sqft_estimate > 0) {
      setField("sqft", String(analysis.sqft_estimate));
    }
    if (analysis.bedrooms > 0) {
      setField("bedrooms", String(analysis.bedrooms));
    }
    if (analysis.bathrooms > 0) {
      setField("bathrooms", String(analysis.bathrooms));
    }

    // Add suggested project types
    if (analysis.suggested_scope_items.length > 0) {
      const currentTypes = form.state.projectTypes;
      const newTypes = [
        ...new Set([...currentTypes, ...analysis.suggested_scope_items]),
      ];
      form.dispatch({ type: "SET_PROJECT_TYPES", types: newTypes });
    }
  }, [analysis, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="size-4" />
          Floor Plan Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`flex min-h-[120px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            dragOver
              ? "border-amber-500 bg-amber-500/5"
              : "border-muted-foreground/25 bg-muted/10 hover:border-muted-foreground/40"
          }`}
        >
          <div className="space-y-2">
            {loading ? (
              <>
                <Loader2 className="mx-auto size-8 animate-spin text-amber-500" />
                <p className="text-sm font-medium text-amber-600">
                  Analyzing floor plan...
                </p>
                <p className="text-xs text-muted-foreground">
                  Claude is reviewing the image for room layout, dimensions, and
                  construction details
                </p>
              </>
            ) : fileName && !error ? (
              <>
                <FileImage className="mx-auto size-8 text-green-600" />
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-muted-foreground">
                  Click or drag to replace
                </p>
              </>
            ) : (
              <>
                <Upload className="mx-auto size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop floor plans here, or click to upload
                </p>
                <p className="text-xs text-muted-foreground/60">
                  JPEG, PNG, GIF, or WebP -- AI will analyze the plan
                </p>
              </>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={onInputChange}
        />

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-4 rounded-lg border-2 border-amber-500/40 bg-amber-50/50 p-4 dark:bg-amber-950/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-amber-600" />
                <h4 className="font-semibold text-amber-800 dark:text-amber-400">
                  AI Analysis Results
                </h4>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={applyToForm}
                className="gap-1.5"
              >
                <Wand2 className="size-3.5" />
                Auto-fill Form
              </Button>
            </div>

            {/* Room counts */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard label="Rooms" value={analysis.room_count} />
              <StatCard label="Bedrooms" value={analysis.bedrooms} />
              <StatCard label="Bathrooms" value={analysis.bathrooms} />
              <StatCard
                label="Est. Sq Ft"
                value={analysis.sqft_estimate.toLocaleString()}
              />
              <StatCard label="Windows" value={analysis.window_count} />
              <StatCard label="Doors" value={analysis.door_count} />
            </div>

            {/* Wall Analysis */}
            {(analysis.load_bearing_walls.length > 0 ||
              analysis.removal_candidates.length > 0) && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  Wall Analysis
                </h5>
                {analysis.load_bearing_walls.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Load-bearing walls:
                    </p>
                    <ul className="space-y-0.5">
                      {analysis.load_bearing_walls.map((wall, i) => (
                        <li key={i} className="text-sm">
                          - {wall}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.removal_candidates.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Removal candidates:
                    </p>
                    <ul className="space-y-0.5">
                      {analysis.removal_candidates.map((wall, i) => (
                        <li key={i} className="text-sm">
                          - {wall}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Construction Notes */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-amber-800 dark:text-amber-400">
                Construction Notes
              </h5>
              <div className="grid gap-2 text-sm">
                {analysis.plumbing_locations.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Plumbing:{" "}
                    </span>
                    {analysis.plumbing_locations.join("; ")}
                  </div>
                )}
                {analysis.electrical_panel && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Electrical Panel:{" "}
                    </span>
                    {analysis.electrical_panel}
                  </div>
                )}
                {analysis.hvac_notes && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      HVAC:{" "}
                    </span>
                    {analysis.hvac_notes}
                  </div>
                )}
              </div>
              {analysis.structural_concerns.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-destructive">
                    Structural Concerns:
                  </p>
                  <ul className="space-y-0.5">
                    {analysis.structural_concerns.map((concern, i) => (
                      <li key={i} className="text-sm text-destructive/80">
                        - {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Suggested Scope */}
            {analysis.suggested_scope_items.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  Suggested Scope
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.suggested_scope_items.map((item) => (
                    <Badge key={item} variant="secondary">
                      {formatScopeLabel(item)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Notes */}
            {analysis.raw_notes && (
              <div className="space-y-1">
                <h5 className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  Additional Notes
                </h5>
                <p className="text-sm text-muted-foreground">
                  {analysis.raw_notes}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md border bg-background p-2 text-center">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function formatScopeLabel(id: string): string {
  const labels: Record<string, string> = {
    interior_remodel: "Interior Remodel",
    kitchen_remodel: "Kitchen Remodel",
    bathroom_remodel: "Bathroom Remodel",
    new_bathroom: "New Bathroom",
    addition_1st: "1st Story Addition",
    addition_2nd: "2nd Story Addition",
    adu_jadu: "ADU / JADU",
    garage_conv: "Garage Conversion",
    flooring: "Flooring",
    painting: "Painting",
    windows_doors: "Windows & Doors",
    roofing: "Roofing",
    exterior_siding: "Exterior & Siding",
    deck_patio: "Deck / Patio",
    sunroom: "Sunroom",
    new_construction: "New Construction",
    garage_conv_1st: "1st Floor Garage Conv",
    garage_conv_2nd: "2nd Floor Garage Conv",
    interior_per_bedroom: "Interior Per Bedroom",
  };
  return labels[id] || id.replace(/_/g, " ");
}
