"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { LeadScoreBadge } from "@/components/shared/lead-score-badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { updateProposalStatus, deleteProposal } from "@/lib/actions/proposals";
import type { DbProposal, PipelineStatus } from "@/lib/types";
import {
  MoreHorizontal,
  ExternalLink,
  Trophy,
  XCircle,
  Trash2,
  Pencil,
  MapPin,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Send,
  Clock,
  Play,
} from "lucide-react";
import { toast } from "sonner";

interface ProposalCardProps {
  proposal: DbProposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const clientName =
    `${proposal.first_name} ${proposal.last_name}`.trim() ||
    "Unnamed Client";

  const isIncomplete =
    !proposal.first_name ||
    !proposal.address ||
    !proposal.project_types?.length ||
    !proposal.project_price;

  const price = proposal.project_price
    ? formatPrice(proposal.project_price)
    : "--";

  const createdDate = proposal.created_at
    ? formatDate(proposal.created_at)
    : "--";

  const updatedDate = proposal.updated_at
    ? formatDate(proposal.updated_at)
    : "--";

  function handleStatusChange(status: PipelineStatus) {
    startTransition(async () => {
      const result = await updateProposalStatus(proposal.id, status);
      if (result.error) {
        toast.error(`Failed to update status: ${result.error}`);
      } else {
        toast.success(
          `Proposal marked as ${status.replace("_", " ")}`
        );
        router.refresh();
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProposal(proposal.id);
      if (result.error) {
        toast.error(`Failed to delete: ${result.error}`);
      } else {
        toast.success("Proposal deleted");
        setDeleteDialogOpen(false);
        router.refresh();
      }
    });
  }

  const scopeLabels = (proposal.project_types ?? [])
    .map((t) =>
      t
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    )
    .join(", ");

  return (
    <>
      <Card
        className="cursor-pointer transition-colors hover:bg-muted/30"
        onClick={() => setExpanded((v) => !v)}
      >
        <CardContent className="p-0">
          {/* Main row */}
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Client info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-foreground">
                  {clientName}
                </span>
                <StatusBadge status={proposal.status} />
                {isIncomplete && (
                  <Badge className="border-orange-500/30 bg-orange-500/15 text-orange-400 hover:bg-orange-500/15">
                    Incomplete
                  </Badge>
                )}
                {proposal.lead_score && (
                  <LeadScoreBadge score={proposal.lead_score} />
                )}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                {proposal.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    <span className="truncate">{proposal.address}</span>
                  </span>
                )}
                {proposal.salespersons?.[0] && (
                  <span className="flex items-center gap-1">
                    <User className="size-3" />
                    {proposal.salespersons[0]}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {createdDate}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <span className="text-sm font-bold text-foreground">{price}</span>
              <div className="text-xs text-muted-foreground">v{proposal.version}</div>
            </div>

            {/* Quick actions */}
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {proposal.status !== "won" && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleStatusChange("won")}
                  disabled={isPending}
                  title="Mark Won"
                >
                  <Trophy className="size-3.5 text-green-400" />
                </Button>
              )}
              {proposal.status !== "lost" && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleStatusChange("lost")}
                  disabled={isPending}
                  title="Mark Lost"
                >
                  <XCircle className="size-3.5 text-red-400" />
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon-xs" />
                  }
                >
                  <MoreHorizontal className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => router.push(`/intake?id=${proposal.id}`)}
                  >
                    <Pencil className="size-3.5" />
                    Edit in Intake
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/library/${proposal.id}`)}
                  >
                    <ExternalLink className="size-3.5" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                    <Play className="size-3.5 text-blue-400" />
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("sent")}>
                    <Send className="size-3.5 text-amber-400" />
                    Sent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("follow_up")}>
                    <Clock className="size-3.5 text-purple-400" />
                    Follow Up
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("won")}>
                    <Trophy className="size-3.5 text-green-400" />
                    Won
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("lost")}>
                    <XCircle className="size-3.5 text-red-400" />
                    Lost
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Expand indicator */}
            <div className="text-muted-foreground">
              {expanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </div>
          </div>

          {/* Expanded details */}
          {expanded && (
            <div className="border-t border-border/50 px-4 py-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4">
                <div>
                  <span className="text-muted-foreground">Property Type</span>
                  <p className="font-medium text-foreground">
                    {proposal.property_type || "--"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sq Ft</span>
                  <p className="font-medium text-foreground">
                    {proposal.sqft ? `${proposal.sqft} sqft` : "--"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Financing</span>
                  <p className="font-medium text-foreground">
                    {proposal.financing || "--"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated</span>
                  <p className="font-medium text-foreground">{updatedDate}</p>
                </div>
                <div className="col-span-2 sm:col-span-4">
                  <span className="text-muted-foreground">Scope</span>
                  <p className="font-medium text-foreground">
                    {scopeLabels || "--"}
                  </p>
                </div>
                {proposal.additional_notes && (
                  <div className="col-span-2 sm:col-span-4">
                    <span className="text-muted-foreground">Notes</span>
                    <p className="font-medium text-foreground">
                      {proposal.additional_notes}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/intake?id=${proposal.id}`);
                  }}
                >
                  <Pencil className="size-3" />
                  Load in Intake
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/library/${proposal.id}`);
                  }}
                >
                  <ExternalLink className="size-3" />
                  View Proposal
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Proposal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the proposal for{" "}
              <strong>{clientName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
