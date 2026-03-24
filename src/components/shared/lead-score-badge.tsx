import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LeadScore } from "@/lib/types";
import { Flame, Sun, Droplets, Snowflake } from "lucide-react";

const scoreConfig: Record<
  LeadScore,
  { label: string; className: string; icon: React.ElementType }
> = {
  hot: {
    label: "Hot",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
    icon: Flame,
  },
  warm: {
    label: "Warm",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    icon: Sun,
  },
  cool: {
    label: "Cool",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    icon: Droplets,
  },
  cold: {
    label: "Cold",
    className: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    icon: Snowflake,
  },
};

interface LeadScoreBadgeProps {
  score: LeadScore;
  className?: string;
}

export function LeadScoreBadge({ score, className }: LeadScoreBadgeProps) {
  const config = scoreConfig[score];
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={cn("gap-1", config.className, className)}
    >
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
}
