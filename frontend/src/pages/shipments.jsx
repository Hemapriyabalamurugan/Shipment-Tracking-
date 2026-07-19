
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "in_transit", label: "In Transit" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "exceptions", label: "Exceptions" },
];

export function ShipmentsPage() {
  const { user } = useAuth();
  const allShipments = useShipments();
  const myShipments = useMyShipments(user.id);
  const [params] = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState("all");
  const [mode, setMode] = useState("all");

  const isCustomerScoped = user.role === "business" || user.role === "customer";
  const shipments = isCustomerScoped ? myShipments.data : allShipments.data;
  const isLoading = isCustomerScoped
    ? myShipments.isLoading
    : allShipments.isLoading;

  const filtered = useMemo(() => {
    if (!shipments) return [];
    return shipments.filter((s) => {
      if (query) {
        const q = query.toLowerCase();
        const matches =
          s.trackingNumber.toLowerCase().includes(q) ||
          s.customer.toLowerCase().includes(q) ||
          s.origin.name.toLowerCase().includes(q) ||
          s.destination.name.toLowerCase().includes(q) ||
          s.carrier.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (mode !== "all" && s.mode !== mode) return false;
      if (status === "all") return true;
      if (status === "active")
        return ["picked_up", "in_transit", "out_for_delivery"].includes(
          s.status,
        );
      if (status === "exceptions")
        return ["delayed", "exception"].includes(s.status);
      return s.status === status;
    });
  }, [shipments, query, status, mode]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={isCustomerScoped ? "My Shipments" : "Shipments"}
        description={
          isCustomerScoped
            ? "Your shipment history & active orders"
            : "Manage and track all shipments"
        }
        icon={Package}
        actions={
          /////////////////////////changes done here business to business_client
          user.role === "business_client" ? (
            <Button asChild>
              <a href="/app/create-shipment">
                <Plus className="mr-2 h-4 w-4" />
                New Shipment
              </a>
            </Button>
          ) : undefined
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tracking #, customer, route…"
              className="pl-9"
            />
          </div>
          {/* <div className="flex items-center gap-2">
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="w-[140px]">
                <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All modes</SelectItem>
                <SelectItem value="road">Road</SelectItem>
                <SelectItem value="air">Air</SelectItem>
                <SelectItem value="ocean">Ocean</SelectItem>
                <SelectItem value="rail">Rail</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>

        {/* ============================================================================================================================= */}
        {/* <Tabs value={status} onValueChange={setStatus}  className="mt-4"> */}
        <Tabs
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            navigate("/app/shipments"); // Change this to your details route
          }}
          className="mt-4"
        >
          <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto p-1">
            {statusFilters.map((f) => (
              <TabsTrigger key={f.value} value={f.value} className="text-xs">
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : filtered.length > 0 ? (
        <ShipmentTable shipments={filtered} showCustomer={!isCustomerScoped} />
      ) : (
        <EmptyState
          icon={Package}
          title="No shipments found"
          description="Try adjusting your filters or search query."
        />
      )}
    </div>
  );
}