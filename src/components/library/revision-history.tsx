"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";
import { updateProposal } from "@/lib/actions/proposals";
import type { RevisionSnapshot } from "@/lib/types";
import { History, RotateCcw, FileText } from "lucide-react";
import { toast } from "sonner";

interface RevisionHistoryProps {
  proposalId: string;
  currentVersion: number;
  revisions: RevisionSnapshot[];
}

export function RevisionHistory({
  proposalId,
  currentVersion,
  revisions,
}: RevisionHistoryProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const sortedRevisions = [...revisions].sort(
    (a, b) => b.version - a.version
  );

  function handleRestore(revision: RevisionSnapshot) {
    startTransition(async () => {
      const snapshot = revision.data_snapshot;

      const newRevision: RevisionSnapshot = {
        version: currentVersion + 1,
        date: new Date().toISOString(),
        notes: `Restored from version ${revision.version}`,
        data_snapshot: snapshot,
      };

      const updateData: Record<string, unknown> = {
        ...snapshot,
        version: currentVersion + 1,
        revisions: [...revisions, newRevision],
      };

      // Remove fields that should not be overwritten
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;

      const result = await updateProposal(
        proposalId,
        updateData as Parameters<typeof updateProposal>[1]
      );

      if (result.error) {
        toast.error(`Failed to restore: ${result.error}`);
      } else {
        toast.success(`Restored to version ${revision.version}`);
        router.refresh();
      }
    });
  }

  if (sortedRevisions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <History className="size-4 text-muted-foreground" />
            Revision History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="size-8 text-muted-foreground/40" />
            <p className="mt-2 text-xs text-muted-foreground">
              No revisions recorded yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <History className="size-4 text-muted-foreground" />
          Revision History
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            Current: v{currentVersion}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {sortedRevisions.map((revision, index) => {
            const isLatest = index === 0;
            const isCurrent = revision.version === currentVersion;

            return (
              <div key={revision.version} className="relative flex gap-3 pb-4 last:pb-0">
                {/* Timeline line */}
                {index < sortedRevisions.length - 1 && (
                  <div className="absolute left-[7px] top-5 h-[calc(100%-8px)] w-px bg-border" />
                )}

                {/* Timeline dot */}
                <div
                  className={`relative mt-1.5 size-[15px] shrink-0 rounded-full border-2 ${
                    isCurrent
                      ? "border-dcb-gold bg-dcb-gold/20"
                      : "border-border bg-background"
                  }`}
                />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      Version {revision.version}
                    </span>
                    {isCurrent && (
                      <span className="rounded bg-dcb-gold/15 px-1.5 py-0.5 text-[10px] font-medium text-dcb-gold">
                        Current
                      </span>
                    )}
                    {isLatest && !isCurrent && (
                      <span className="rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {revision.date ? formatDate(revision.date) : "--"}
                  </p>
                  {revision.notes && (
                    <p className="mt-1 text-xs text-muted-foreground/80">
                      {revision.notes}
                    </p>
                  )}
                  {!isCurrent && (
                    <Button
                      variant="ghost"
                      size="xs"
                      className="mt-1.5"
                      onClick={() => handleRestore(revision)}
                      disabled={isPending}
                    >
                      <RotateCcw className="size-3" />
                      {isPending ? "Restoring..." : "Restore"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
