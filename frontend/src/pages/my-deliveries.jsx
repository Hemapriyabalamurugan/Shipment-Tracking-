
import { useMemo, useState } from "react";
import { useMyShipments, usePodRecords } from "@/lib/hooks";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, relativeDay, formatDateTime, timeAgo } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ChevronRight,
  PackageCheck,
  PenLine,
  PackageX,
} from "lucide-react";

const statusTabs = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "delivered", label: "Delivered" },
  { value: "exceptions", label: "Issues" },
];

export function MyDeliveriesPage() {
  const { user } = useAuth();
  const myShipments = useMyShipments(user.id);
  const podRecords = usePodRecords();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const all = myShipments.data ?? [];

  const filtered = useMemo(() => {
    return all.filter((s) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !s.trackingNumber.toLowerCase().includes(q) &&
          !s.origin.name.toLowerCase().includes(q) &&
          !s.destination.name.toLowerCase().includes(q) &&
          !s.carrier.toLowerCase().includes(q)
        )
          return false;
      }
      if (status === "all") return true;
      if (status === "active")
        return [
          "in_transit",
          "out_for_delivery",
          "picked_up",
          "pending",
        ].includes(s.status);
      if (status === "delivered") return s.status === "delivered";
      if (status === "exceptions")
        return ["delayed", "exception", "cancelled"].includes(s.status);
      return true;
    });
  }, [all, query, status]);

  const podMap = new Map(
    (podRecords.data ?? []).map((p) => [p.trackingNumber, p]),
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="My Deliveries"
        description="All your shipments and delivery records"
        icon={Package}
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tracking #, route, carrier..."
              className="pl-9"
            />
          </div>
          <Tabs value={status} onValueChange={setStatus}>
            <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto p-1">
              {statusTabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="text-xs">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {myShipments.isLoading ? (
        <LoadingState />
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((s) => (
            <DeliveryCard
              key={s.id}
              shipment={s}
              pod={podMap.get(s.trackingNumber)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title="No deliveries found"
          description="Try adjusting your search or filter."
        />
      )}
    </div>
  );
}

function DeliveryCard({ shipment, pod }) {
  const isDelivered = shipment.status === "delivered";
  const isOutForDelivery = shipment.status === "out_for_delivery";
  const isException = ["delayed", "exception", "cancelled"].includes(
    shipment.status,
  );

  return (
    <Card className="overflow-hidden transition hover:shadow-sm">
      <Link to={`/app/shipments/${shipment.id}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                isDelivered
                  ? "bg-success/10 text-success"
                  : isOutForDelivery
                    ? "bg-warning/10 text-warning"
                    : isException
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary",
              )}
            >
              {isDelivered ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : isException ? (
                <PackageX className="h-5 w-5" />
              ) : (
                <Truck className="h-5 w-5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold">
                  {shipment.trackingNumber}
                </span>
                <StatusBadge status={shipment.status} size="sm" />
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {shipment.origin.name} → {shipment.destination.name}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-semibold",
                  isDelivered
                    ? "text-success"
                    : isOutForDelivery
                      ? "text-warning"
                      : "text-foreground",
                )}
              >
                {isDelivered
                  ? "Delivered"
                  : relativeDay(shipment.estimatedDelivery)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {shipment.carrier}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isDelivered
                  ? "bg-success"
                  : isOutForDelivery
                    ? "bg-warning"
                    : isException
                      ? "bg-destructive"
                      : "gradient-brand",
              )}
              style={{ width: `${shipment.progress}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> {shipment.currentLocation.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />{" "}
              {formatDateTime(shipment.estimatedDelivery)}
            </span>
            {shipment.pieces > 1 && (
              <span className="flex items-center gap-1.5">
                <Package className="h-3 w-3" /> {shipment.pieces} pieces
              </span>
            )}
          </div>
        </CardContent>
      </Link>

      {pod && (
        <div className="flex items-center gap-3 border-t border-border bg-muted/20 px-4 py-2.5">
          <PackageCheck
            className={cn(
              "h-4 w-4",
              pod.status === "verified"
                ? "text-success"
                : "text-muted-foreground",
            )}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium">
              {pod.status === "verified"
                ? `Signed by ${pod.signedBy} · ${timeAgo(pod.deliveryTime)}`
                : "Proof of delivery pending"}
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              {pod.location}
            </p>
          </div>
          {pod.status === "verified" && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-success">
              <PenLine className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
      )}
    </Card>
  );
}