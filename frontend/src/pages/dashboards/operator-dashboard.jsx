
import { useAuth } from "@/context/auth-context";
import { useShipments, useNotifications } from "@/lib/hooks";
import { StatCard } from "@/components/shared/stat-card";
import { LoadingState } from "@/components/shared/states";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, timeAgo, relativeDay } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Navigation,
  Camera,
  PenLine,
  MapPin,
  ArrowRight,
  ClipboardCheck,
  Bell,
  Activity,
} from "lucide-react";

const STATUS_FLOW = [
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    class: "bg-muted text-muted-foreground",
  },
  {
    key: "picked_up",
    label: "Picked Up",
    icon: Package,
    class: "bg-primary/10 text-primary",
  },
  {
    key: "in_transit",
    label: "In Transit",
    icon: Truck,
    class: "bg-chart-6/10 text-chart-6",
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    icon: Navigation,
    class: "bg-warning/15 text-warning",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: CheckCircle2,
    class: "bg-success/10 text-success",
  },
  {
    key: "failed",
    label: "Failed",
    icon: XCircle,
    class: "bg-destructive/10 text-destructive",
  },
];

export default function OperatorDashboard() {
  const { user } = useAuth();
  const shipments = useShipments();
  const notifications = useNotifications();
  const isLoading = shipments.isLoading;

  const assigned = shipments.data ?? [];
  const pending = assigned.filter(
    (s) => s.status === "pending" || s.status === "picked_up",
  );
  const active = assigned.filter(
    (s) => s.status === "in_transit" || s.status === "out_for_delivery",
  );
  const delivered = assigned.filter((s) => s.status === "delivered");
  const failed = assigned.filter(
    (s) => s.status === "failed" || s.status === "exception",
  );
  const recentNotifications = notifications.data?.slice(0, 5) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <OperatorHeader userName={user.name} activeCount={0} />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* <OperatorHeader userName={user.name} activeCount={active.length} /> */}
      <OperatorHeader userName={user.name} activeCount={active.length} />//

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Active Deliveries"
          value={active.length}
          icon={Navigation}
          iconClass="bg-primary/10 text-primary"
          trend={{ value: "live", direction: "neutral" }}
        />
        <StatCard
          label="Pending Pickup"
          value={pending.length}
          icon={Clock}
          iconClass="bg-warning/15 text-warning"
        />
        <StatCard
          label="Delivered Today"
          value={delivered.length}
          icon={CheckCircle2}
          iconClass="bg-success/10 text-success"
        />
        <StatCard
          label="Failed"
          value={failed.length}
          icon={XCircle}
          iconClass="bg-destructive/10 text-destructive"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-primary" />
                My Assignments
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                {assigned.length} total
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Shipments assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 max-h-[520px] overflow-y-auto scrollbar-thin pt-0">
            {active.length === 0 && pending.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-success/40" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No active assignments
                </p>
              </div>
            ) : (
              [...active, ...pending].map((s) => (
                <AssignmentCard key={s.id} shipment={s} />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bell className="h-4 w-4 text-chart-6" />
                Recent Updates
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[520px] overflow-y-auto scrollbar-thin">
            {recentNotifications.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No notifications
              </p>
            ) : (
              recentNotifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-2.5 rounded-lg border border-border p-2.5"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                      n.type === "success"
                        ? "bg-success/10 text-success"
                        : n.type === "warning"
                          ? "bg-warning/15 text-warning"
                          : "bg-primary/10 text-primary",
                    )}
                  >
                    <Activity className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{n.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {n.message}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {timeAgo(n.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Completed Today
          </CardTitle>
          <CardDescription className="text-xs">
            Recently delivered shipments
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {delivered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No deliveries completed yet
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {delivered.slice(0, 6).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="min-w-0">
                    <Link
                      to={`/app/shipments/${s.id}`}
                      className="font-mono text-xs font-semibold hover:underline"
                    >
                      {s.trackingNumber}
                    </Link>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {s.origin.name} → {s.destination.name}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Delivered
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OperatorHeader({ userName, activeCount }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-white shadow-lg shadow-primary/20">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Operator Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              {userName} — your delivery assignments at a glance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2",
              activeCount > 0
                ? "border-primary/30 bg-primary/5"
                : "border-success/30 bg-success/5",
            )}
          >
            <span
              className={cn(
                "flex h-2 w-2 animate-pulse-soft rounded-full",
                activeCount > 0 ? "bg-primary" : "bg-success",
              )}
            />
            <span
              className={cn(
                "text-xs font-semibold",
                activeCount > 0 ? "text-primary" : "text-success",
              )}
            >
              {activeCount > 0 ? `${activeCount} Active` : "All Clear"}
            </span>
          </div>
          <Button asChild variant="outline" size="sm">
            {/* <Link to="/app/pod">
              <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />
              Submit POD
            </Link> */}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AssignmentCard({ shipment }) {
  const isActive =
    shipment.status === "in_transit" || shipment.status === "out_for_delivery";
  const isPending =
    shipment.status === "pending" || shipment.status === "picked_up";
  const statusMeta =
    STATUS_FLOW.find((s) => s.key === shipment.status) ?? STATUS_FLOW[0];
  const StatusIcon = statusMeta.icon;

  return (
    // <Link
    //   to={`/app/shipments/${shipment.id}`}
    //   className="block rounded-lg border border-border p-3 transition hover:border-primary/40 hover:bg-muted/30"
    // >
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              statusMeta.class,
            )}
          >
            <StatusIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold">
              {shipment.trackingNumber}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {shipment.origin.name} → {shipment.destination.name}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium",
            statusMeta.class,
          )}
        >
          {statusMeta.label}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {shipment.currentLocation.name}
        </span>
        <span>
          ETA:{" "}
          <span className="font-medium text-foreground">
            {relativeDay(shipment.estimatedDelivery)}
          </span>
        </span>
        <span>
          Progress:{" "}
          <span className="font-medium text-foreground">
            {shipment.progress}%
          </span>
        </span>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full",
            shipment.status === "delivered"
              ? "bg-success"
              : shipment.status === "failed"
                ? "bg-destructive"
                : shipment.status === "out_for_delivery"
                  ? "bg-warning"
                  : "bg-primary",
          )}
          style={{ width: `${shipment.progress}%` }}
        />
      </div>

      {isActive && (
        <div className="mt-2.5 flex items-center gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-7 text-[11px]"
          >
            <Link to={`/app/shipments/${shipment.id}`}>
              <Navigation className="mr-1 h-3 w-3" />
              Navigate
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-7 text-[11px]"
          >
            <Link to="/app/pod">
              <Camera className="mr-1 h-3 w-3" />
              Upload Photo
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-7 text-[11px]"
          >
            <Link to="/app/pod">
              <PenLine className="mr-1 h-3 w-3" />
              Signature
            </Link>
          </Button>
        </div>
  )
  }
  </>
    // </Link>
  );
}