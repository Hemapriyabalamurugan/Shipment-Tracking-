

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMyShipments } from "@/lib/hooks";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { ShipmentTable } from "@/components/shared/shipment-table";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Search } from "lucide-react";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "exceptions", label: "Issues" },
];

export function MyDeliveriesPage() {
  const { user, loading: authLoading } = useAuth();
  const myShipments = useMyShipments(user?.id);
  const [params] = useSearchParams();

  const initialQuery = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState("all");

  const shipments = myShipments.data ?? [];

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      const shipmentStatus = String(s.status ?? "")
        .trim()
        .toLowerCase();

      // Search
      if (query) {
        const q = query.toLowerCase();

        const matches =
          (s.trackingNumber?.toLowerCase() ?? "").includes(q) ||
          (s.customer?.toLowerCase() ?? "").includes(q) ||
          (
            s.origin?.name?.toLowerCase() ??
            s.senderCity?.toLowerCase() ??
            ""
          ).includes(q) ||
          (
            s.destination?.name?.toLowerCase() ??
            s.receiverCity?.toLowerCase() ??
            ""
          ).includes(q) ||
          (s.carrier?.toLowerCase() ?? "").includes(q);

        if (!matches) return false;
      }

      // All
      if (status === "all") {
        return true;
      }

      // Active
      if (status === "active") {
        return [
          "picked_up",
          "in_transit",
          "out_for_delivery",
          "pending",
        ].includes(shipmentStatus);
      }

      // Delivered
      if (status === "DELIVERED") {
        return shipmentStatus === "delivered";
      }

      // In Transit
      if (status === "IN_TRANSIT") {
        return shipmentStatus === "in_transit";
      }

      // Out for Delivery
      if (status === "OUT_FOR_DELIVERY") {
        return shipmentStatus === "out_for_delivery";
      }

      // Exceptions
      if (status === "exceptions") {
        return [
          "delayed",
          "exception",
          "cancelled",
          "failed_delivery",
        ].includes(shipmentStatus);
      }

      return true;
    });
  }, [shipments, query, status]);

  if (authLoading) {
    return <LoadingState label="Loading deliveries..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Deliveries"
        description="All your shipments and delivery records"
        icon={Package}
      />

      <Card className="p-4 shadow-card border-border/80 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracking #, route, carrier..."
            className="pl-10 text-xs rounded-xl"
          />
        </div>

        <Tabs value={status} onValueChange={setStatus} className="w-full">
          <TabsList className="flex w-full flex-wrap justify-start gap-1.5 h-auto p-1 bg-muted/60 rounded-xl">
            {statusFilters.map((filter) => (
              <TabsTrigger
                key={filter.value}
                value={filter.value}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              >
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>

      {myShipments.isLoading ? (
        <LoadingState label="Loading deliveries..." />
      ) : filtered.length > 0 ? (
        <ShipmentTable shipments={filtered} showCustomer={false} />
      ) : (
        <EmptyState
          icon={Package}
          title="No deliveries found"
          description="Try clearing your search query or switching your active filters."
        />
      )}
    </div>
  );
}