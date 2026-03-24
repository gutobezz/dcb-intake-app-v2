"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeOrderForm } from "@/components/change-orders/change-order-form";
import { ChangeOrderList } from "@/components/change-orders/change-order-list";
import type { DbProposal } from "@/lib/types";
import type { DbChangeOrder } from "@/lib/actions/change-orders";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

export function TabChangeOrder() {
  const [proposals, setProposals] = useState<DbProposal[]>([]);
  const [changeOrders, setChangeOrders] = useState<DbChangeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<DbChangeOrder | undefined>();

  async function fetchData() {
    try {
      const supabase = createClient();

      const [proposalsRes, changeOrdersRes] = await Promise.all([
        supabase
          .from("proposals")
          .select("*")
          .order("updated_at", { ascending: false }),
        supabase
          .from("change_orders")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (proposalsRes.error) {
        toast.error("Failed to load proposals: " + proposalsRes.error.message);
      } else {
        setProposals((proposalsRes.data ?? []) as DbProposal[]);
      }

      if (changeOrdersRes.error) {
        toast.error("Failed to load change orders: " + changeOrdersRes.error.message);
      } else {
        setChangeOrders((changeOrdersRes.data ?? []) as DbChangeOrder[]);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleNewOrder() {
    setEditingOrder(undefined);
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-dcb-gold" />
        <span className="ml-2 text-sm text-muted-foreground">Loading change orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showForm ? (
        <ChangeOrderForm
          proposals={proposals}
          changeOrder={editingOrder}
        />
      ) : (
        <>
          <div className="flex items-center justify-end">
            <Button onClick={handleNewOrder} size="sm">
              <Plus className="mr-1 size-4" />
              New Change Order
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Change Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <ChangeOrderList
                changeOrders={changeOrders}
                proposals={proposals}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
