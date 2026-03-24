import { redirect } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeOrderList } from "@/components/change-orders/change-order-list";
import { ChangeOrderForm } from "@/components/change-orders/change-order-form";
import type { DbProposal } from "@/lib/types";
import type { DbChangeOrder } from "@/lib/actions/change-orders";

interface PageProps {
  searchParams: Promise<{ new?: string; edit?: string; view?: string }>;
}

export default async function ChangeOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch proposals for the dropdown
  const { data: proposals } = await supabase
    .from("proposals")
    .select("*")
    .order("updated_at", { ascending: false });

  const typedProposals = (proposals ?? []) as DbProposal[];

  // Fetch all change orders
  const { data: changeOrders } = await supabase
    .from("change_orders")
    .select("*")
    .order("created_at", { ascending: false });

  const typedChangeOrders = (changeOrders ?? []) as DbChangeOrder[];

  // If editing, find the change order
  const editingId = params.edit;
  const editingOrder = editingId
    ? typedChangeOrders.find((co) => co.id === editingId)
    : undefined;

  const showForm = params.new !== undefined || !!editingOrder;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-dcb-gold/10">
            <FileText className="size-5 text-dcb-gold" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Change Orders
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage change orders for active projects
            </p>
          </div>
        </div>

        {!showForm && (
          <a href="/change-orders?new">
            <Button>
              <Plus className="mr-1 size-4" />
              New Change Order
            </Button>
          </a>
        )}
      </div>

      {showForm ? (
        <ChangeOrderForm
          proposals={typedProposals}
          changeOrder={editingOrder}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Change Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangeOrderList
              changeOrders={typedChangeOrders}
              proposals={typedProposals}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
