"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";
import type { DbProposal } from "@/lib/types";
import { DollarSign, Trophy, FileText, TrendingUp } from "lucide-react";

interface PipelineStatsProps {
  proposals: DbProposal[];
}

function parsePrice(price: string): number {
  const cleaned = price.replace(/[^0-9.]/g, "");
  return cleaned ? parseFloat(cleaned) : 0;
}

export function PipelineStats({ proposals }: PipelineStatsProps) {
  const totalProposals = proposals.length;

  const activeStatuses = ["active", "sent", "follow_up"] as const;
  const pipelineTotal = proposals
    .filter((p) => activeStatuses.includes(p.status as (typeof activeStatuses)[number]))
    .reduce((sum, p) => sum + parsePrice(p.project_price), 0);

  const wonProposals = proposals.filter((p) => p.status === "won");
  const wonTotal = wonProposals.reduce(
    (sum, p) => sum + parsePrice(p.project_price),
    0
  );

  const closedCount = wonProposals.length + proposals.filter((p) => p.status === "lost").length;
  const conversionRate = closedCount > 0
    ? Math.round((wonProposals.length / closedCount) * 100)
    : 0;

  const stats = [
    {
      title: "Total Proposals",
      value: totalProposals.toString(),
      icon: FileText,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
    },
    {
      title: "Active Pipeline",
      value: formatPrice(pipelineTotal),
      icon: DollarSign,
      iconColor: "text-dcb-gold",
      iconBg: "bg-dcb-gold/10",
    },
    {
      title: "Won",
      value: formatPrice(wonTotal),
      icon: Trophy,
      iconColor: "text-green-400",
      iconBg: "bg-green-500/10",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} size="sm">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`flex size-7 items-center justify-center rounded-md ${stat.iconBg}`}
              >
                <Icon className={`size-3.5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold tracking-tight">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
