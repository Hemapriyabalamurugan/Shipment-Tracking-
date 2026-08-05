import { useAuth } from "@/context/auth-context";
import {
  useShipments,
  useVehicles,
  useTeam,
  useAnalytics,
  useActivity,
  useMicroservices,
  usePodRecords,
  useNotificationMetrics,
  useDrivers,
} from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ShipmentTable } from "@/components/shared/shipment-table";
import { LoadingState } from "@/components/shared/states";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import {
  Package,
  Truck,
  Users,
  ArrowRight,
  Radar,
  ClipboardCheck,
  Server,
  Activity as ActivityIcon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const shipments = useShipments();
  const vehicles = useVehicles();
  const drivers = useDrivers();
  const team = useTeam();
  const analytics = useAnalytics();
  const activity = useActivity();
  const microservices = useMicroservices();
  const podRecords = usePodRecords();
  const notificationMetrics = useNotificationMetrics();

  const isLoading =
    shipments.isLoading ||
    vehicles.isLoading ||
    analytics.isLoading ||
    microservices.isLoading;

  const activeShipments =
    shipments.data?.filter((s) =>
      ["IN_TRANSIT", "OUT_FOR_DELIVERY", "PICKED_UP"].includes(s.status),
    ) ?? [];
  const activeVehicles =
    vehicles.data?.filter((v) => v.status === "active") ?? [];
  const pendingPod =
    podRecords.data?.filter(
      (p) => p.status === "pending" || p.status === "missing",
    ) ?? [];
  const totalUsers = team.data?.length ?? 0;

  const operationalMs =
    microservices.data?.filter((m) => m.status === "operational").length ?? 0;
  const totalMs = microservices.data?.length ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Command Center"
          description="Platform-wide operations & system health"
          icon={Radar}
        />
        <LoadingState label="Loading Command Center metrics..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Command Center Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-card">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-brand text-white shadow-md shadow-primary/25 border border-white/20">
              <Radar className="h-6 w-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl text-foreground">
                  Command Center
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Systems Operational ({operationalMs}/{totalMs || 4})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Welcome back, <span className="font-semibold text-foreground">{user.firstName ?? user.name}</span> — real-time logistics operations & fleet telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/app/routes">
                <Zap className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Manage Routes
              </Link>
            </Button>
            <Button asChild variant="brand" size="sm">
              <Link to="/app/shipments">
                View All Shipments
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={formatNumber(totalUsers)}
          icon={Users}
          iconClass="bg-primary/10 text-primary border border-primary/20"
          footer="Active registered accounts"
        />
        <StatCard
          label="Total Shipments"
          value={formatNumber(shipments.data?.length ?? 0)}
          icon={Package}
          iconClass="bg-chart-6/10 text-chart-6 border border-chart-6/20"
          footer="All-time platform shipments"
        />
        <StatCard
          label="Active Deliveries"
          value={formatNumber(activeShipments.length)}
          icon={Truck}
          iconClass="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
          trend={{ value: "LIVE", direction: "up", positive: true }}
          footer="In transit right now"
        />
        <StatCard
          label="Pending POD"
          value={formatNumber(pendingPod.length)}
          icon={ClipboardCheck}
          iconClass="bg-amber-500/10 text-amber-600 border border-amber-500/20"
          footer="Awaiting verification"
        />
      </div>

      {/* Active Shipments Section */}
      <div className="grid gap-6 grid-cols-1">
        <Card className="shadow-card border-border/80">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ActivityIcon className="h-4.5 w-4.5 text-primary" />
                  Active In-Transit Shipments
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time monitor of packages currently dispatched across carrier networks
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
                <Link to="/app/shipments">
                  View All ({shipments.data?.length ?? 0})
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <ShipmentTable
              shipments={activeShipments}
              emptyLabel="No active shipments in transit"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

