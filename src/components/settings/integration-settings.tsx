"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, GitBranch, FileSignature, Brain } from "lucide-react";

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "connected" | "not_configured" | "requires_key";
  statusLabel: string;
}

function IntegrationCard({
  name,
  description,
  icon,
  status,
  statusLabel,
}: IntegrationCardProps) {
  const statusVariant: Record<string, "default" | "secondary" | "destructive"> =
    {
      connected: "default",
      not_configured: "secondary",
      requires_key: "destructive",
    };

  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">{name}</h4>
            <Badge variant={statusVariant[status]}>{statusLabel}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface IntegrationSettingsProps {
  pipedriveConfigured: boolean;
  docusignConfigured: boolean;
  anthropicConfigured: boolean;
}

export function IntegrationSettings({
  pipedriveConfigured,
  docusignConfigured,
  anthropicConfigured,
}: IntegrationSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground">Integrations</h3>
        <p className="text-xs text-muted-foreground">
          Manage third-party service connections
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <IntegrationCard
          name="Supabase"
          description="PostgreSQL database for proposals, users, and CRM data. Handles authentication and row-level security."
          icon={<Database className="size-5 text-emerald-500" />}
          status="connected"
          statusLabel="Connected"
        />

        <IntegrationCard
          name="Pipedrive"
          description="CRM pipeline sync. Proposals are automatically synced to Pipedrive deals when created or updated."
          icon={<GitBranch className="size-5 text-blue-500" />}
          status={pipedriveConfigured ? "connected" : "not_configured"}
          statusLabel={pipedriveConfigured ? "Connected" : "Not configured"}
        />

        <IntegrationCard
          name="DocuSign"
          description="Digital signatures for contracts and change orders. Requires integration key and account configuration."
          icon={<FileSignature className="size-5 text-amber-500" />}
          status={docusignConfigured ? "connected" : "requires_key"}
          statusLabel={
            docusignConfigured ? "Connected" : "Integration key required"
          }
        />

        <IntegrationCard
          name="Anthropic AI"
          description="Powers floor plan analysis, AI revision assistant, and PDF import features using Claude."
          icon={<Brain className="size-5 text-purple-500" />}
          status={anthropicConfigured ? "connected" : "not_configured"}
          statusLabel={anthropicConfigured ? "Connected" : "Not configured"}
        />
      </div>
    </div>
  );
}
