"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight, Hammer, ClipboardList } from "lucide-react";
import { PROJECT_TYPES, FINISH_OPTIONS } from "@/lib/types";
import type { ProposalFormReturn } from "@/hooks/use-proposal-form";

interface TabScopeProps {
  form: ProposalFormReturn;
}

export function TabScope({ form }: TabScopeProps) {
  const { state, toggleProjectType, toggleScopeItem, setField } = form;
  const [expandedDescs, setExpandedDescs] = useState<Record<string, boolean>>(
    {}
  );

  const toggleDesc = useCallback((itemKey: string) => {
    setExpandedDescs((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  }, []);

  // Auto-check std items when a project type is first selected
  const [autoCheckedTypes, setAutoCheckedTypes] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    for (const ptId of state.projectTypes) {
      if (autoCheckedTypes.has(ptId)) continue;
      const ptDef = PROJECT_TYPES.find((p) => p.id === ptId);
      if (!ptDef) continue;
      for (const item of ptDef.items) {
        if (item.std) {
          const scopeKey = `${ptId}::${item.id}`;
          if (!state.scopeItems[scopeKey]) {
            toggleScopeItem(scopeKey);
          }
        }
      }
      setAutoCheckedTypes((prev) => new Set(prev).add(ptId));
    }
  }, [state.projectTypes, autoCheckedTypes, toggleScopeItem, state.scopeItems]);

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
              {pt.label} -- Scope Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {pt.items.map((item) => {
                const scopeKey = `${pt.id}::${item.id}`;
                const isChecked = state.scopeItems[scopeKey] ?? false;
                const isExpanded = expandedDescs[scopeKey] ?? false;
                const descOverride = state.descOverrides[scopeKey];
                const descText = descOverride ?? item.description;
                const descBullets = descText
                  .split("\n")
                  .filter((l) => l.trim());

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
                        {item.std && (
                          <Badge
                            variant="secondary"
                            className="ml-1 text-[10px] bg-green-500/15 text-green-600 border-green-500/30"
                          >
                            Standard
                          </Badge>
                        )}
                        {item.opt && (
                          <Badge
                            variant="secondary"
                            className="ml-1 text-[10px] bg-amber-500/15 text-amber-600 border-amber-500/30"
                          >
                            Optional
                          </Badge>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="size-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="size-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </div>

                    {/* Finish selection dropdowns */}
                    {isChecked && item.finishKey && FINISH_OPTIONS[item.finishKey] && (
                      <div className="mt-2 pl-7">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground whitespace-nowrap">
                            Finish:
                          </Label>
                          <Select
                            value={state.finishSelections[scopeKey] ?? ""}
                            onValueChange={(val) =>
                              setField("finishSelections", {
                                ...state.finishSelections,
                                [scopeKey]: val,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select finish..." />
                            </SelectTrigger>
                            <SelectContent>
                              {FINISH_OPTIONS[item.finishKey].map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    {isChecked &&
                      item.finishKey2 &&
                      FINISH_OPTIONS[item.finishKey2] && (
                        <div className="mt-1 pl-7">
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground whitespace-nowrap">
                              {item.finishKey2 === "drywall_texture"
                                ? "Texture:"
                                : item.finishKey2 === "vanity"
                                  ? "Vanity:"
                                  : "Option:"}
                            </Label>
                            <Select
                              value={
                                state.finishSelections[
                                  `${scopeKey}__2`
                                ] ?? ""
                              }
                              onValueChange={(val) =>
                                setField("finishSelections", {
                                  ...state.finishSelections,
                                  [`${scopeKey}__2`]: val,
                                })
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {FINISH_OPTIONS[item.finishKey2].map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                    {/* Description bullets / editable textarea */}
                    {isExpanded && (
                      <div className="mt-3 pl-7 space-y-2">
                        {descBullets.length > 0 && (
                          <ul className="list-disc pl-4 space-y-0.5">
                            {descBullets.map((line, li) => (
                              <li
                                key={li}
                                className="text-xs text-muted-foreground leading-relaxed"
                              >
                                {line}
                              </li>
                            ))}
                          </ul>
                        )}
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
