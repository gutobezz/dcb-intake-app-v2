import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { LeadScoreBadge } from "@/components/shared/lead-score-badge";
import { RevisionHistory } from "@/components/library/revision-history";
import { formatPrice, formatDate, formatPhone } from "@/lib/utils/format";
import type { DbProposal } from "@/lib/types";
import {
  ArrowLeft,
  Pencil,
  FileText,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  DollarSign,
  Ruler,
} from "lucide-react";
import { ProposalDetailActions } from "./actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: proposal, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !proposal) {
    notFound();
  }

  const p = proposal as DbProposal;

  const clientName =
    `${p.client_first_name} ${p.client_last_name}`.trim() || "Unnamed Client";

  const price = p.project_price ? formatPrice(p.project_price) : "--";
  const createdDate = p.created_at ? formatDate(p.created_at) : "--";
  const updatedDate = p.updated_at ? formatDate(p.updated_at) : "--";

  const scopeLabels = (p.project_types ?? [])
    .map((t) =>
      t
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    )
    .join(", ");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/library">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">
                {clientName}
              </h1>
              <StatusBadge status={p.status} />
              {p.lead_score && <LeadScoreBadge score={p.lead_score} />}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {p.address || "No address"} &middot; {price} &middot; v
              {p.version}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/intake?id=${p.id}`}>
            <Button variant="outline" size="sm">
              <Pencil className="size-3" />
              Edit
            </Button>
          </Link>
          <ProposalDetailActions proposalId={p.id} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Main info — spans 2 cols */}
        <div className="space-y-4 md:col-span-2">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="size-4 text-muted-foreground" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Name</span>
                  <p className="font-medium">{clientName}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Email</span>
                  <p className="flex items-center gap-1 font-medium">
                    <Mail className="size-3 text-muted-foreground" />
                    {p.client_email || "--"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Phone</span>
                  <p className="flex items-center gap-1 font-medium">
                    <Phone className="size-3 text-muted-foreground" />
                    {p.client_phone ? formatPhone(p.client_phone) : "--"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    Referral Source
                  </span>
                  <p className="font-medium">{p.referral_source || "--"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Advisor</span>
                  <p className="font-medium">
                    {p.salespersons?.join(", ") || "--"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Home className="size-4 text-muted-foreground" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-xs text-muted-foreground">Address</span>
                  <p className="flex items-center gap-1 font-medium">
                    <MapPin className="size-3 text-muted-foreground" />
                    {p.address || "--"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    Property Type
                  </span>
                  <p className="font-medium">{p.property_type || "--"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    Year Built
                  </span>
                  <p className="font-medium">{p.year_built ?? "--"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Sq Ft</span>
                  <p className="flex items-center gap-1 font-medium">
                    <Ruler className="size-3 text-muted-foreground" />
                    {p.sqft ? `${p.sqft}` : "--"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    Bedrooms
                  </span>
                  <p className="font-medium">{p.bedrooms ?? "--"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    Bathrooms
                  </span>
                  <p className="font-medium">{p.bathrooms ?? "--"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Stories</span>
                  <p className="font-medium">{p.stories || "--"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scope & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="size-4 text-muted-foreground" />
                Scope & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">
                    Project Types
                  </span>
                  <p className="font-medium">{scopeLabels || "--"}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Project Price
                    </span>
                    <p className="flex items-center gap-1 text-lg font-bold text-dcb-gold">
                      <DollarSign className="size-4" />
                      {price}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Budget Range
                    </span>
                    <p className="font-medium">{p.budget_range || "--"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Financing
                    </span>
                    <p className="font-medium">{p.financing || "--"}</p>
                  </div>
                </div>

                {/* Payment schedule */}
                {p.payment_schedule && p.payment_schedule.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Payment Schedule
                    </span>
                    <div className="mt-1 space-y-1">
                      {p.payment_schedule.map((pm, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1.5 text-xs"
                        >
                          <span>{pm.milestone}</span>
                          <span className="font-medium">
                            {pm.amount
                              ? formatPrice(pm.amount)
                              : pm.percentage
                                ? `${pm.percentage}%`
                                : "--"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allowances */}
                {p.allowances && p.allowances.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Allowances
                    </span>
                    <div className="mt-1 space-y-1">
                      {p.allowances.map((a, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1.5 text-xs"
                        >
                          <span>{a.description}</span>
                          <span className="font-medium">
                            {a.amount ? formatPrice(a.amount) : "--"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {p.additional_notes && (
                  <div>
                    <span className="text-xs text-muted-foreground">Notes</span>
                    <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted/30 p-2.5 text-xs">
                      {p.additional_notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar — right column */}
        <div className="space-y-4">
          {/* Meta card */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{createdDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">{updatedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">v{p.version}</span>
                </div>
                {p.contract_signed_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Contract Signed
                    </span>
                    <span className="font-medium">
                      {formatDate(p.contract_signed_at)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lead info */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm">Lead Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={p.status} />
                </div>
                {p.lead_score && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lead Score</span>
                    <LeadScoreBadge score={p.lead_score} />
                  </div>
                )}
                {p.priorities && p.priorities.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Priorities</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.priorities.map((pr) => (
                        <span
                          key={pr}
                          className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium"
                        >
                          {pr}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {p.notes_tags && p.notes_tags.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Tags</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.notes_tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-dcb-gold/10 px-1.5 py-0.5 text-[10px] font-medium text-dcb-gold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Revision History */}
          <RevisionHistory
            proposalId={p.id}
            currentVersion={p.version}
            revisions={p.revisions ?? []}
          />
        </div>
      </div>
    </div>
  );
}
