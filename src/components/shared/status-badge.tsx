import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PipelineStatus } from "@/lib/types";

const statusConfig: Record<PipelineStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  sent: {
    label: "Sent",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  follow_up: {
    label: "Follow Up",
    className: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
  won: {
    label: "Won",
    className: "bg-green-500/15 text-green-400 border-green-500/30",
  },
  lost: {
    label: "Lost",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },
};

interface StatusBadgeProps {
  status: PipelineStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
