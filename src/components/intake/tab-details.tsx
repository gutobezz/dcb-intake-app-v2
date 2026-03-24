"use client";

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
} from "lucide-react";
import {
  ADVISORS,
  CLIENT_PRIORITIES,
  type LeadScore,
  type Allowance,
  type PaymentMilestone,
} from "@/lib/types";
import type { ProposalFormReturn } from "@/hooks/use-proposal-form";

const FINANCING_TYPES = ["Cash", "Loan", "HELOC", "Other"] as const;

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
              <Input
                id="budgetRange"
                placeholder="$120k - $180k"
                value={state.budgetRange}
                onChange={(e) => setField("budgetRange", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  {FINANCING_TYPES.map((f) => (
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
                    <div className="w-[140px] space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Amount
                      </Label>
                      <PriceInput
                        value={state.allowances[index].amount}
                        onChange={(val) =>
                          dispatch({
                            type: "UPDATE_ALLOWANCE",
                            index,
                            field: "amount",
                            value: val,
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch({ type: "ADD_PAYMENT_MILESTONE" })}
            >
              <Plus className="size-3.5" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.paymentSchedule.map((_: PaymentMilestone, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-border/50 p-3"
              >
                <div className="flex flex-1 flex-wrap gap-3">
                  <div className="min-w-[140px] flex-1 space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Milestone
                    </Label>
                    <Input
                      placeholder="e.g. Down Payment"
                      value={state.paymentSchedule[index].milestone}
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
                  <div className="w-[120px] space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Amount
                    </Label>
                    <PriceInput
                      value={state.paymentSchedule[index].amount}
                      onChange={(val) =>
                        dispatch({
                          type: "UPDATE_PAYMENT_MILESTONE",
                          index,
                          field: "amount",
                          value: val,
                        })
                      }
                    />
                  </div>
                  <div className="w-[80px] space-y-1">
                    <Label className="text-xs text-muted-foreground">%</Label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={state.paymentSchedule[index].percentage}
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
            ))}
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
                  <Input
                    type="number"
                    className="w-20"
                    value={state.followUpDays}
                    onChange={(e) => setField("followUpDays", e.target.value)}
                  />
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
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="vip, realm, rush, luxury"
                value={state.notesTags.join(", ")}
                onChange={(e) =>
                  dispatch({
                    type: "SET_NOTES_TAGS",
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
