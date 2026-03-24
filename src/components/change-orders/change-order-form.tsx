"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Send } from "lucide-react";
import {
  createChangeOrder,
  updateChangeOrder,
  type DbChangeOrder,
} from "@/lib/actions/change-orders";
import type { ChangeOrderLineItem, DbProposal } from "@/lib/types";
import { toast } from "sonner";

interface ChangeOrderFormProps {
  proposals: DbProposal[];
  changeOrder?: DbChangeOrder;
}

const EMPTY_LINE_ITEM: ChangeOrderLineItem = {
  description: "",
  quantity: 1,
  unit_price: "",
  total: "",
};

export function ChangeOrderForm({
  proposals,
  changeOrder,
}: ChangeOrderFormProps) {
  const router = useRouter();
  const isEditing = !!changeOrder;

  const [proposalId, setProposalId] = useState(
    changeOrder?.proposal_id ?? ""
  );
  const [type, setType] = useState<"increase" | "decrease">(
    changeOrder?.type ?? "increase"
  );
  const [lineItems, setLineItems] = useState<ChangeOrderLineItem[]>(
    changeOrder?.line_items?.length
      ? changeOrder.line_items
      : [{ ...EMPTY_LINE_ITEM }]
  );
  const [scopeDescription, setScopeDescription] = useState(
    changeOrder?.scope_description ?? ""
  );
  const [timelineExtension, setTimelineExtension] = useState(
    String(changeOrder?.timeline_extension_days ?? 0)
  );
  const [saving, setSaving] = useState(false);

  const calculateLineTotal = useCallback(
    (item: ChangeOrderLineItem): string => {
      const qty = Number(item.quantity) || 0;
      const price = parseFloat(item.unit_price.replace(/[^0-9.]/g, "")) || 0;
      return (qty * price).toFixed(2);
    },
    []
  );

  const grandTotal = lineItems.reduce((sum, item) => {
    const lineTotal = parseFloat(calculateLineTotal(item)) || 0;
    return sum + lineTotal;
  }, 0);

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(grandTotal);

  function updateLineItem(
    index: number,
    field: keyof ChangeOrderLineItem,
    value: string | number
  ) {
    setLineItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      updated[index].total = calculateLineTotal(updated[index]);
      return updated;
    });
  }

  function addLineItem() {
    setLineItems((prev) => [...prev, { ...EMPTY_LINE_ITEM }]);
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSave() {
    if (!proposalId) {
      toast.error("Please select a client / proposal");
      return;
    }

    if (lineItems.every((item) => !item.description.trim())) {
      toast.error("Please add at least one line item");
      return;
    }

    setSaving(true);

    const payload = {
      proposal_id: proposalId,
      type,
      line_items: lineItems.map((item) => ({
        ...item,
        total: calculateLineTotal(item),
      })),
      scope_description: scopeDescription,
      timeline_extension_days: parseInt(timelineExtension) || 0,
      total_amount: formattedTotal,
      status: "draft" as const,
    };

    try {
      const result = isEditing
        ? await updateChangeOrder(changeOrder.id, payload)
        : await createChangeOrder(payload);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          isEditing
            ? "Change order updated"
            : "Change order saved as draft"
        );
        router.push("/change-orders");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Client / Proposal selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client & Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Proposal</Label>
            <Select value={proposalId} onValueChange={(v) => setProposalId(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a proposal..." />
              </SelectTrigger>
              <SelectContent>
                {proposals.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.client_first_name} {p.client_last_name} &mdash;{" "}
                    {p.address || "No address"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Change Order Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(val) =>
                setType(val as "increase" | "decrease")
              }
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="increase" />
                <Label className="cursor-pointer font-normal">
                  Increase (add scope / cost)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="decrease" />
                <Label className="cursor-pointer font-normal">
                  Decrease (reduce scope / cost)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Line Items</CardTitle>
          <Button variant="outline" size="sm" onClick={addLineItem}>
            <Plus className="mr-1 size-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Header */}
            <div className="hidden grid-cols-[1fr_80px_120px_100px_40px] gap-2 text-xs font-medium text-muted-foreground md:grid">
              <span>Description</span>
              <span>Qty</span>
              <span>Unit Price</span>
              <span>Line Total</span>
              <span />
            </div>

            {lineItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-2 rounded-lg border border-border/50 p-3 md:grid-cols-[1fr_80px_120px_100px_40px] md:border-0 md:p-0"
              >
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    updateLineItem(index, "description", e.target.value)
                  }
                />
                <Input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    updateLineItem(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                />
                <Input
                  placeholder="$0.00"
                  value={item.unit_price}
                  onChange={(e) =>
                    updateLineItem(index, "unit_price", e.target.value)
                  }
                />
                <div className="flex items-center text-sm font-medium text-foreground">
                  $
                  {parseFloat(calculateLineTotal(item)).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2 }
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeLineItem(index)}
                  disabled={lineItems.length <= 1}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}

            {/* Grand total */}
            <div className="flex items-center justify-end gap-4 border-t border-border pt-3">
              <span className="text-sm font-medium text-muted-foreground">
                {type === "increase" ? "Total Increase" : "Total Decrease"}:
              </span>
              <span className="text-lg font-semibold text-foreground">
                {formattedTotal}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scope & Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scope & Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Scope Description</Label>
            <Textarea
              placeholder="Describe the scope changes in detail..."
              value={scopeDescription}
              onChange={(e) => setScopeDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Timeline Extension (days)</Label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={timelineExtension}
              onChange={(e) => setTimelineExtension(e.target.value)}
              className="w-32"
            />
            <p className="text-xs text-muted-foreground">
              Number of additional days added to the project timeline
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={() => router.push("/change-orders")}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-1 size-4" />
          {saving ? "Saving..." : "Save Draft"}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button disabled className="pointer-events-none opacity-50">
                <Send className="mr-1 size-4" />
                Send via DocuSign
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              DocuSign integration key required. Configure in Settings &gt;
              Integrations.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
