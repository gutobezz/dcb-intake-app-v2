"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  deleteProposal,
  updateProposalStatus,
} from "@/lib/actions/proposals";
import type { PipelineStatus } from "@/lib/types";
import {
  MoreHorizontal,
  Trash2,
  FileText,
  Send,
  Trophy,
  XCircle,
  Play,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface ProposalDetailActionsProps {
  proposalId: string;
}

export function ProposalDetailActions({
  proposalId,
}: ProposalDetailActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function handleStatusChange(status: PipelineStatus) {
    startTransition(async () => {
      const result = await updateProposalStatus(proposalId, status);
      if (result.error) {
        toast.error(`Failed to update status: ${result.error}`);
      } else {
        toast.success(`Status changed to ${status.replace("_", " ")}`);
        router.refresh();
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProposal(proposalId);
      if (result.error) {
        toast.error(`Failed to delete: ${result.error}`);
      } else {
        toast.success("Proposal deleted");
        router.push("/library");
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="icon-sm" />}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
          <DropdownMenuLabel>Generate</DropdownMenuLabel>
          <DropdownMenuItem disabled>
            <FileText className="size-3.5" />
            Generate PDF
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Send className="size-3.5" />
            Send Contract
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
            Delete Proposal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Proposal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this proposal? This action cannot
              be undone.
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
