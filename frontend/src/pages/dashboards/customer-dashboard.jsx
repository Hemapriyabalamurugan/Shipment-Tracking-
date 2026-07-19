
import { useAuth } from "@/context/auth-context";
import { useMyShipments, usePodRecords } from "@/lib/hooks";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { MapView } from "@/components/shared/map-view";
import { TrackingTimeline } from "@/components/shared/tracking-timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, relativeDay, formatDateTime, timeAgo } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  PackageCheck,
  PenLine,
  Search,
  ChevronRight,
  Navigation,
} from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const myShipments = useMyShipments(user.id);
  const podRecords = usePodRecords();
  const isLoading = myShipments.isLoading;

  const all = myShipments.data ?? [];
  const active = all.filter((s) =>
    ["in_transit", "out_for_delivery", "picked_up", "pending"].includes(
      s.status,
    ),
  );
  const delivered = all.filter((s) => s.status === "delivered");
  const outForDelivery = all.filter((s) => s.status === "out_for_delivery");
  const featured =
    active.find((s) => s.status === "out_for_delivery") ?? active[0] ?? all[0];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* <CustomerHeader userName={user.name} /> */}
        <CustomerHeader userName={user?.email || "Customer"} />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* <CustomerHeader userName={user.name} /> */}

      <CustomerHeader userName={user?.email || "Customer"} />
      <div className="grid grid-cols-3 gap-3">
        <MiniStat
          label="Active"
          value={active.length}
          icon={Truck}
          class="bg-primary/10 text-primary"
        />
        <MiniStat
          label="Out for Delivery"
          value={outForDelivery.length}
          icon={Package}
          class="bg-warning/10 text-warning"
        />
        <MiniStat
          label="Delivered"
          value={delivered.length}
          icon={CheckCircle2}
          class="bg-success/10 text-success"
        />
      </div>

      {featured ? (
        <FeaturedTrackingCard shipment={featured} />
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold">No active deliveries</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your shipments will appear here once booked.
            </p>
          </CardContent>
        </Card>
      )}

      {featured && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Navigation className="h-4 w-4 text-primary" />
                Live Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px]">
                <MapView
                  shipment={featured}
                  className="!rounded-none h-[300px]"
                />
              </div>
              <div className="flex items-center justify-between border-t border-border p-3 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />{" "}
                  {featured.currentLocation.name}
                </span>
                <span className="font-semibold text-primary">
                  {featured.progress}% complete
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Delivery Timeline</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[360px] overflow-y-auto scrollbar-thin">
              <TrackingTimeline events={featured.events} />
            </CardContent>
          </Card>
        </div>
      )}

      {podRecords.data && podRecords.data.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <PackageCheck className="h-4 w-4 text-success" />
                Delivery Proof
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/app/deliveries">
                  View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {podRecords.data.slice(0, 4).map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                    {rec.status === "verified" ? (
                      <div className="flex flex-col items-center gap-0.5 text-success">
                        <PenLine className="h-5 w-5" />
                        <span className="text-[9px] font-medium">Signed</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                        <PenLine className="h-5 w-5 opacity-40" />
                        <span className="text-[9px]">Pending</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">
                      {rec.trackingNumber}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {rec.location}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                      {rec.status === "verified"
                        ? `Signed by ${rec.signedBy} · ${timeAgo(rec.deliveryTime)}`
                        : "Awaiting confirmation"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Current Deliveries</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/deliveries">
                All deliveries <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {all.length > 0 ? (
            <div className="space-y-2.5">
              {all.map((s) => (
                <DeliveryRow key={s.id} shipment={s} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="No deliveries yet"
              description="When you have shipments, they'll appear here for easy tracking."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerHeader({ userName }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {/* Hi, {userName.split(" ")[0]}! */}

          {/*  changes done here */}
          Hi, {userName ? userName.split("@")[0] : "Customer"}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your packages and deliveries
        </p>
      </div>
      <Button asChild size="sm" className="lg:hidden">
        <Link to="/app/track">
          <Search className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon, class: cls }) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            cls,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-lg font-bold leading-none">{value}</p>
          <p className="text-[10px] text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function FeaturedTrackingCard({ shipment }) {
  const etaLabel = relativeDay(shipment.estimatedDelivery);
  const isOutForDelivery = shipment.status === "out_for_delivery";

  return (
    <Card className="overflow-hidden">
      <div
        className={cn(
          "relative p-5 sm:p-6",
          isOutForDelivery
            ? "bg-gradient-to-br from-warning/10 via-warning/5 to-transparent"
            : "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl shadow-lg",
                isOutForDelivery
                  ? "bg-warning text-white shadow-warning/20"
                  : "gradient-brand text-white shadow-primary/20",
              )}
            >
              <Truck className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">
                {isOutForDelivery ? "Arriving today" : "In transit"}
              </p>
              <p className="text-lg font-bold">{etaLabel}</p>
            </div>
          </div>
          <StatusBadge status={shipment.status} />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{shipment.origin.name}</span>
            <span className="font-medium text-foreground">
              {shipment.progress}%
            </span>
            <span>{shipment.destination.name}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isOutForDelivery ? "bg-warning" : "gradient-brand",
              )}
              style={{ width: `${shipment.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            Currently at {shipment.currentLocation.name}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            ETA {formatDateTime(shipment.estimatedDelivery)}
          </span>
        </div>

        <Button asChild className="mt-5 w-full sm:w-auto">
          <Link to={`/app/shipments/${shipment.id}`}>
            View full details <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-3">
        <div>
          <p className="text-[10px] text-muted-foreground">Tracking Number</p>
          <p className="font-mono text-sm font-semibold">
            {shipment.trackingNumber}
          </p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/app/track">
            Track <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function DeliveryRow({ shipment }) {
  const isDelivered = shipment.status === "delivered";
  const isOutForDelivery = shipment.status === "out_for_delivery";

  return (
    <Link
      to={`/app/shipments/${shipment.id}`}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition hover:border-primary/30 hover:shadow-sm"
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          isDelivered
            ? "bg-success/10 text-success"
            : isOutForDelivery
              ? "bg-warning/10 text-warning"
              : "bg-primary/10 text-primary",
        )}
      >
        {isDelivered ? (
          <CheckCircle2 className="h-5 w-5" />
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
            "text-xs font-semibold",
            isOutForDelivery && "text-warning",
          )}
        >
          {isDelivered ? "Delivered" : relativeDay(shipment.estimatedDelivery)}
        </p>
        <p className="text-[11px] text-muted-foreground">{shipment.carrier}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}