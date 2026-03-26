"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Eye } from "lucide-react";
import { deleteChangeOrder, type DbChangeOrder } from "@/lib/actions/change-orders";
import type { DbProposal } from "@/lib/types";
import { toast } from "sonner";

interface ChangeOrderListProps {
  changeOrders: DbChangeOrder[];
  proposals: DbProposal[];
}

const STATUS_BADGE: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Sent", variant: "outline" },
  signed: { label: "Signed", variant: "default" },
};

export function ChangeOrderList({
  changeOrders,
  proposals,
}: ChangeOrderListProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const proposalMap = new Map(proposals.map((p) => [p.id, p]));

  function getClientName(proposalId: string): string {
    const p = proposalMap.get(proposalId);
    if (!p) return "Unknown";
    return `${p.first_name} ${p.last_name}`.trim() || "Unnamed";
  }

  function getAddress(proposalId: string): string {
    const p = proposalMap.get(proposalId);
    return p?.address || "No address";
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const result = await deleteChangeOrder(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Change order deleted");
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete change order");
    } finally {
      setDeleting(null);
    }
  }

  if (changeOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No change orders yet. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {changeOrders.map((co) => {
          const badge = STATUS_BADGE[co.status] ?? STATUS_BADGE.draft;
          return (
            <TableRow key={co.id}>
              <TableCell className="font-medium">
                {getClientName(co.proposal_id)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getAddress(co.proposal_id)}
              </TableCell>
              <TableCell>
                <span
                  className={
                    co.type === "increase"
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }
                >
                  {co.type === "increase" ? "Increase" : "Decrease"}
                </span>
              </TableCell>
              <TableCell>{co.total_amount || "$0.00"}</TableCell>
              <TableCell>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(co.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      router.push(`/change-orders?edit=${co.id}`)
                    }
                    title="Edit"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      router.push(`/change-orders?view=${co.id}`)
                    }
                    title="View"
                  >
                    <Eye className="size-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive"
                          title="Delete"
                        />
                      }
                    >
                      <Trash2 className="size-4" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Delete Change Order</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this change order for{" "}
                          <strong>{getClientName(co.proposal_id)}</strong>? This
                          action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose
                          render={<Button variant="outline" />}
                        >
                          Cancel
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(co.id)}
                          disabled={deleting === co.id}
                        >
                          {deleting === co.id
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
