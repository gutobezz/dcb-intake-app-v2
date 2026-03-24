"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronRight, Hammer, ClipboardList } from "lucide-react";
import { PROJECT_TYPES } from "@/lib/types";
import type { ProposalFormReturn } from "@/hooks/use-proposal-form";

interface TabScopeProps {
  form: ProposalFormReturn;
}

export function TabScope({ form }: TabScopeProps) {
  const { state, toggleProjectType, toggleScopeItem, setField } = form;
  const [expandedDescs, setExpandedDescs] = useState<Record<string, boolean>>({});

  const toggleDesc = useCallback((itemKey: string) => {
    setExpandedDescs((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  }, []);

  const selectedTypes = PROJECT_TYPES.filter((pt) =>
    state.projectTypes.includes(pt.id)
  );

  return (
    <div className="space-y-6">
      {/* Project type selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hammer className="size-4" />
            Project Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECT_TYPES.map((pt) => {
              const isSelected = state.projectTypes.includes(pt.id);
              return (
                <label
                  key={pt.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    isSelected
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleProjectType(pt.id)}
                  />
                  <span className="text-sm font-medium">{pt.label}</span>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Scope items per selected project type */}
      {selectedTypes.map((pt) => (
        <Card key={pt.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="size-4" />
              {pt.label} — Scope Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {pt.items.map((item) => {
                const scopeKey = `${pt.id}::${item.id}`;
                const isChecked = state.scopeItems[scopeKey] ?? false;
                const isExpanded = expandedDescs[scopeKey] ?? false;
                const descOverride = state.descOverrides[scopeKey];

                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-3 transition-colors ${
                      isChecked
                        ? "border-primary/30 bg-primary/5"
                        : "border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleScopeItem(scopeKey)}
                      />
                      <button
                        type="button"
                        onClick={() => toggleDesc(scopeKey)}
                        className="flex flex-1 items-center gap-2 text-left"
                      >
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="size-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="size-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="mt-3 pl-7">
                        <Textarea
                          value={descOverride ?? item.description}
                          onChange={(e) =>
                            setField("descOverrides", {
                              ...state.descOverrides,
                              [scopeKey]: e.target.value,
                            })
                          }
                          className="min-h-[60px] text-sm"
                          placeholder="Edit description..."
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Scope notes */}
      {selectedTypes.length > 0 && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Additional Scope Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="General scope notes, special instructions, client requests..."
                value={state.scopeNotes?.["_general"] ?? ""}
                onChange={(e) =>
                  setField("scopeNotes", {
                    ...state.scopeNotes,
                    _general: e.target.value,
                  })
                }
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>
        </>
      )}

      {selectedTypes.length === 0 && (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <div className="text-center">
            <Hammer className="mx-auto mb-3 size-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Select one or more project types above to configure scope items
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
