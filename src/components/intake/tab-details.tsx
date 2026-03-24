"use client";

import { useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceInput } from "@/components/shared/price-input";
import { LeadScoreBadge } from "@/components/shared/lead-score-badge";
import {
  DollarSign,
  Calendar,
  CreditCard,
  ListChecks,
  Users,
  Bell,
  Star,
  StickyNote,
  Plus,
  Trash2,
  Flame,
  Sun,
  Droplets,
  Snowflake,
  Clock,
  Tag,
} from "lucide-react";
import {
  ADVISORS,
  CLIENT_PRIORITIES,
  type LeadScore,
  type Allowance,
  type PaymentMilestone,
} from "@/lib/types";
import {
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
  FINANCING_OPTIONS,
  DEFAULT_NOTES_TAGS,
  FOLLOWUP_OPTIONS,
} from "@/lib/constants/advisors";
import {
  DEFAULT_ALLOWANCES,
  ALLOWANCE_ELIGIBLE_PROJECT_TYPES,
} from "@/lib/constants/default-allowances";
import type { ProposalFormReturn } from "@/hooks/use-proposal-form";

const LEAD_SCORE_OPTIONS: {
  value: LeadScore;
  icon: React.ElementType;
}[] = [
  { value: "hot", icon: Flame },
  { value: "warm", icon: Sun },
  { value: "cool", icon: Droplets },
  { value: "cold", icon: Snowflake },
];

interface TabDetailsProps {
  form: ProposalFormReturn;
}

export function TabDetails({ form }: TabDetailsProps) {
  const { state, setField, dispatch, togglePriority, toggleSalesperson } = form;
  const hasAutoPopulated = useRef(false);

  // Auto-populate allowances when eligible project types are selected
  const hasEligibleType = useMemo(
    () =>
      state.projectTypes.some((pt) =>
        (ALLOWANCE_ELIGIBLE_PROJECT_TYPES as readonly string[]).includes(pt)
      ),
    [state.projectTypes]
  );

  useEffect(() => {
    if (hasEligibleType && state.allowances.length === 0 && !hasAutoPopulated.current) {
      hasAutoPopulated.current = true;
      const allowances = DEFAULT_ALLOWANCES.map((a) => ({
        description: a.label,
        amount: a.amount,
      }));
      setField("allowances", allowances);
    }
  }, [hasEligibleType, state.allowances.length, setField]);

  // Compute payment schedule percentage total
  const percentTotal = state.paymentSchedule.reduce(
    (sum, p) => sum + (parseFloat(p.percentage) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="size-4" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectPrice">
                Project Price{" "}
                <span className="text-xs text-muted-foreground">
                  (shown on proposal)
                </span>
              </Label>
              <PriceInput
                id="projectPrice"
                value={state.projectPrice}
                onChange={(val) => setField("projectPrice", val)}
                placeholder="150,000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetRange">
                Budget Range{" "}
                <Badge variant="secondary" className="ml-1 text-[10px]">
                  Internal
                </Badge>
              </Label>
              <Select
                value={state.budgetRange}
                onValueChange={(val) => setField("budgetRange", val)}
              >
                <SelectTrigger id="budgetRange" className="w-full">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>
                <Clock className="mr-1 inline size-3.5" />
                Timeline
              </Label>
              <Select
                value={state.timeline}
                onValueChange={(val) => setField("timeline", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desiredStartDate">
                <Calendar className="mr-1 inline size-3.5" />
                Desired Start Date
              </Label>
              <Input
                id="desiredStartDate"
                type="date"
                value={state.desiredStartDate}
                onChange={(e) => setField("desiredStartDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>
                <CreditCard className="mr-1 inline size-3.5" />
                Financing
              </Label>
              <Select
                value={state.financing}
                onValueChange={(val) => setField("financing", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {FINANCING_OPTIONS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allowances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ListChecks className="size-4" />
              Allowances
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch({ type: "ADD_ALLOWANCE" })}
            >
              <Plus className="size-3.5" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            Allowance amounts included within the project price for
            client-selected materials/fixtures.
          </div>
          {state.allowances.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No allowances yet. Click Add to create one.
            </p>
          ) : (
            <div className="space-y-3">
              {state.allowances.map((_: Allowance, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-border/50 p-3"
                >
                  <div className="flex flex-1 gap-3">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Description
                      </Label>
                      <Input
                        placeholder="e.g. Tile installation"
                        value={state.allowances[index].description}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_ALLOWANCE",
                            index,
                            field: "description",
                            value: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="w-[160px] space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Amount
                      </Label>
                      <Input
                        placeholder="e.g. Up to $5/sqft"
                        value={state.allowances[index].amount}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_ALLOWANCE",
                            index,
                            field: "amount",
                            value: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="mt-5 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      dispatch({ type: "REMOVE_ALLOWANCE", index })
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard className="size-4" />
              Payment Schedule
            </span>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold ${
                  percentTotal === 100
                    ? "text-green-500"
                    : percentTotal > 100
                      ? "text-red-500"
                      : "text-amber-500"
                }`}
              >
                Total: {percentTotal}%
                {percentTotal !== 100 &&
                  (percentTotal < 100
                    ? ` (need ${100 - percentTotal}% more)`
                    : ` (${percentTotal - 100}% over)`)}
                {percentTotal === 100 && " OK"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: "ADD_PAYMENT_MILESTONE" })}
              >
                <Plus className="size-3.5" />
                Add
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.paymentSchedule.map(
              (pm: PaymentMilestone, index: number) => {
                const price = parseFloat(
                  String(state.projectPrice).replace(/[^0-9.]/g, "")
                );
                const computedAmt =
                  pm.fixed && pm.amount
                    ? pm.amount
                    : price && pm.percentage
                      ? `$${Math.round(
                          (price * parseFloat(pm.percentage)) / 100
                        ).toLocaleString()}`
                      : pm.percentage
                        ? `${pm.percentage}%`
                        : "";

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-border/50 p-3"
                  >
                    <div className="flex flex-1 flex-wrap gap-3">
                      <div className="min-w-[180px] flex-1 space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Milestone
                        </Label>
                        <Input
                          placeholder="e.g. Upon Framing Complete"
                          value={pm.milestone}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_PAYMENT_MILESTONE",
                              index,
                              field: "milestone",
                              value: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="w-[80px] space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          %
                        </Label>
                        <Input
                          type="number"
                          placeholder="10"
                          value={pm.percentage}
                          disabled={pm.fixed}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_PAYMENT_MILESTONE",
                              index,
                              field: "percentage",
                              value: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="w-[120px] space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Amount
                        </Label>
                        {pm.fixed ? (
                          <Input
                            value={pm.amount}
                            onChange={(e) =>
                              dispatch({
                                type: "UPDATE_PAYMENT_MILESTONE",
                                index,
                                field: "amount",
                                value: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <Input
                            value={computedAmt}
                            disabled
                            className="text-muted-foreground"
                          />
                        )}
                      </div>
                      {pm.fixed && (
                        <Badge
                          variant="outline"
                          className="mt-6 text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/30"
                        >
                          Fixed
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="mt-5 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        dispatch({ type: "REMOVE_PAYMENT_MILESTONE", index })
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Lead Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="size-4" />
            Lead Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={state.leadScore}
            onValueChange={(val) => setField("leadScore", val)}
            className="flex flex-wrap gap-4"
          >
            {LEAD_SCORE_OPTIONS.map(({ value }) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2"
              >
                <RadioGroupItem value={value} />
                <LeadScoreBadge score={value} />
              </label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Assignment & Follow-up */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" />
            Job Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Salespersons</Label>
              <div className="flex flex-wrap gap-2">
                {ADVISORS.map((adv) => {
                  const isSelected = state.salespersons.includes(adv);
                  return (
                    <label
                      key={adv}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                        isSelected
                          ? "border-primary/50 bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted-foreground/30"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSalesperson(adv)}
                        className="size-3.5"
                      />
                      {adv}
                    </label>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={state.followUp}
                  onCheckedChange={(checked) => setField("followUp", checked)}
                />
                <Label className="flex items-center gap-1.5">
                  <Bell className="size-3.5" />
                  Follow-up Reminder
                </Label>
              </div>
              {state.followUp && (
                <div className="flex items-center gap-2">
                  <Select
                    value={state.followUpDays}
                    onValueChange={(val) => setField("followUpDays", val)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FOLLOWUP_OPTIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priorities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="size-4" />
            Client Priorities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {CLIENT_PRIORITIES.map((p) => {
              const isSelected = state.priorities.includes(p);
              return (
                <label
                  key={p}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    isSelected
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-muted-foreground/30"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => togglePriority(p)}
                    className="size-3.5"
                  />
                  {p}
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="size-4" />
            Additional Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Internal notes, observations, follow-up items..."
              value={state.additionalNotes}
              onChange={(e) => setField("additionalNotes", e.target.value)}
              className="min-h-[100px]"
            />
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Tag className="size-3.5" />
                Quick Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_NOTES_TAGS.map((tag) => {
                  const isSelected = state.notesTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => {
                        const newTags = isSelected
                          ? state.notesTags.filter((t) => t !== tag)
                          : [...state.notesTags, tag];
                        dispatch({ type: "SET_NOTES_TAGS", tags: newTags });
                      }}
                      className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                        isSelected
                          ? "border-primary/50 bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted-foreground/30"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
