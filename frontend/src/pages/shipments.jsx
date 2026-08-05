import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useShipments, useMyShipments } from "@/lib/hooks";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { ShipmentTable } from "@/components/shared/shipment-table";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Search, SlidersHorizontal, Plus } from "lucide-react";

const statusFilters = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "exceptions", label: "Exceptions" },
];

export function ShipmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const allShipments = useShipments();
  const myShipments = useMyShipments(
    user?.role === "customer" ? user?.id : null,
  );
  const [params] = useSearchParams();
  
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState("all");
  const [mode, setMode] = useState("all");

  const isCustomerScoped = user?.role === "customer";
  const shipments = isCustomerScoped
    ? (myShipments.data ?? [])
    : (allShipments.data ?? []);
  const isLoading =
    authLoading ||
    (isCustomerScoped ? myShipments.isLoading : allShipments.isLoading);

  const filtered = useMemo(() => {
    if (!shipments) return [];
    return shipments.filter((s) => {
      if (query) {
        const q = query.toLowerCase();
        const matches =
          (s.trackingNumber?.toLowerCase() ?? "").includes(q) ||
          (s.customer?.toLowerCase() ?? "").includes(q) ||
          (s.origin?.name?.toLowerCase() ?? s.senderCity?.toLowerCase() ?? "").includes(q) ||
          (s.destination?.name?.toLowerCase() ?? s.receiverCity?.toLowerCase() ?? "").includes(q) ||
          (s.carrier?.toLowerCase() ?? "").includes(q);
        if (!matches) return false;
      }
      if (mode !== "all" && s.mode?.toLowerCase() !== mode.toLowerCase()) return false;
      if (status === "all") return true;
      if (status === "active")
        return ["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "picked_up", "in_transit", "out_for_delivery"].includes(
          s.status,
        );
      if (status === "exceptions")
        return ["delayed", "exception", "FAILED_DELIVERY"].includes(s.status);
      return s.status === status || s.status?.toLowerCase() === status.toLowerCase();
    });
  }, [shipments, query, status, mode]);

  if (authLoading) {
    return <LoadingState label="Authenticating session..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={isCustomerScoped ? "My Shipments" : "Shipment Operations"}
        description={
          isCustomerScoped
            ? "Your active packages and historical order records"
            : "Platform-wide shipment dispatch, telemetry, and tracking"
        }
        icon={Package}
        actions={
          (user.role === "business_client" || user.role === "ADMIN" || user.role === "admin") ? (
            <Button asChild variant="brand" size="sm" className="font-bold text-xs">
              <Link to="/app/create-shipment">
                <Plus className="mr-1.5 h-4 w-4" />
                New Shipment
              </Link>
            </Button>
          ) : undefined
        }
      />

      <Card className="p-4 shadow-card border-border/80 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tracking #, customer, origin, carrier..."
              className="pl-10 text-xs rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="w-[150px] text-xs font-semibold rounded-xl">
                <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All modes</SelectItem>
                <SelectItem value="road">Road</SelectItem>
                <SelectItem value="air">Air</SelectItem>
                <SelectItem value="ocean">Ocean</SelectItem>
                <SelectItem value="rail">Rail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={status} onValueChange={setStatus} className="w-full">
          <TabsList className="flex w-full flex-wrap justify-start gap-1.5 h-auto p-1 bg-muted/60 rounded-xl">
            {statusFilters.map((f) => (
              <TabsTrigger key={f.value} value={f.value} className="text-xs font-semibold px-3 py-1.5 rounded-lg">
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>

      {isLoading ? (
        <LoadingState label="Loading shipments..." />
      ) : filtered.length > 0 ? (
        <ShipmentTable shipments={filtered} showCustomer={!isCustomerScoped} />
      ) : (
        <EmptyState
          icon={Package}
          title="No shipments found"
          description="Try clearing your search query or switching your active filters."
        />
      )}
    </div>
  );
}

