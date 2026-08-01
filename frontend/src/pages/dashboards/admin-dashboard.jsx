
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
import { ChartTooltip } from "@/components/shared/brand-backdrop";
import { MapView } from "@/components/shared/map-view";
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
import { cn, formatNumber, timeAgo } from "@/lib/utils";
import {
  Package,
  Truck,
  Users,
  Activity,
  ArrowRight,
  Server,
  Gauge,
  Radar,
  ClipboardCheck,
  Bell,
  CircleDot,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Network,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  Bar,
  BarChart,
} from "recharts";

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
  const exceptions =
    shipments.data?.filter((s) =>
      ["delayed", "exception"].includes(s.status),
    ) ?? [];
  const activeVehicles =
    vehicles.data?.filter((v) => v.status === "active") ?? [];
  const driversOnline =
    drivers.data?.filter((d) => d.status === "on_duty") ?? [];
  const pendingPod =
    podRecords.data?.filter(
      (p) => p.status === "pending" || p.status === "missing",
    ) ?? [];
  const totalUsers = team.data?.length ?? 0;
  const notifMetrics = notificationMetrics.data ?? [];
  const totalNotifSent = notifMetrics.reduce((s, n) => s + n.sent, 0);
  const avgOpenRate = notifMetrics.length
    ? notifMetrics.reduce((s, n) => s + n.openRate, 0) / notifMetrics.length
    : 0;

  const vehiclePoints =
    vehicles.data
      ?.filter((v) => v.status !== "offline")
      .map((v) => ({
        lat: v.lat,
        lng: v.lng,
        name: `${v.unit} · ${v.driver}`,
        status: v.status,
      })) ?? [];

  const operationalMs =
    microservices.data?.filter((m) => m.status === "operational").length ?? 0;
  const totalMs = microservices.data?.length ?? 0;
  const degradedMs =
    microservices.data?.filter(
      (m) => m.status === "degraded" || m.status === "down",
    ).length ?? 0;

  


  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Command Center"
          description="Platform-wide operations & system health"
        />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-white shadow-lg shadow-primary/20">
              <Radar className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Command Center
              </h1>

              <p className="text-sm text-muted-foreground">
                Welcome back, {user.firstName ?? user.name} — real-time
                logistics operations overview
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> */}
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        <StatCard
          label="Total Users"
          value={formatNumber(totalUsers)}
          icon={Users}
          iconClass="bg-primary/10 text-primary"
          // trend={{ value: "+142", direction: "up", positive: true }}
          // footer="this month"
        />
        <StatCard
          label="Total Shipments"
          value={formatNumber(shipments.data?.length ?? 0)}
          icon={Package}
          iconClass="bg-chart-6/10 text-chart-6"
          // trend={{ value: "+12.4%", direction: "up", positive: true }}
          // footer="vs last month"
        />
        <StatCard
          label="Active Deliveries"
          value={formatNumber(activeShipments.length)}
          icon={Truck}
          iconClass="bg-success/10 text-success"
          // trend={{ value: "live", direction: "neutral" }}
          // footer="in transit now"
        />

        <StatCard
          label="Pending POD"
          value={pendingPod.length}
          icon={ClipboardCheck}
          iconClass="bg-warning/10 text-warning"
          // trend={{ value: "awaiting", direction: "neutral" }}
          // footer="proof of delivery"
        />
      </div>

      {/* {/* Activity Feed + Shipments */}
      {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-3"> */}
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Shipments</CardTitle>
                <CardDescription>
                  Currently in transit across the network
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/app/shipments">
                  View all <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ShipmentTable
              shipments={activeShipments}
              emptyLabel="No active shipments"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}