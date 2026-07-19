
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
      ["in_transit", "out_for_delivery", "picked_up"].includes(s.status),
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
              {/* <p className="text-sm text-muted-foreground">
                Welcome back, {user.name.split(" ")[0]} — real-time logistics
                operations overview
              </p> */}
              <p className="text-sm text-muted-foreground">
                Welcome back, {user.firstName} — real-time logistics operations
                overview
              </p>
            </div>
          </div>
          {/* <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-3 py-2">
              <span className="flex h-2 w-2 animate-pulse-soft rounded-full bg-success" />
              <span className="text-xs font-semibold text-success">
                All Systems Operational
              </span>
            </div> 
            <Button asChild variant="outline" size="sm">
              <Link to="/app/system-monitoring">
                <Server className="mr-1.5 h-3.5 w-3.5" />
                System Monitor
              </Link>
            </Button>
          </div> */}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Users"
          value={formatNumber(totalUsers + 1910)}
          icon={Users}
          iconClass="bg-primary/10 text-primary"
          trend={{ value: "+142", direction: "up", positive: true }}
          footer="this month"
        />
        <StatCard
          label="Total Shipments"
          value={formatNumber(4148)}
          icon={Package}
          iconClass="bg-chart-6/10 text-chart-6"
          trend={{ value: "+12.4%", direction: "up", positive: true }}
          footer="vs last month"
        />
        <StatCard
          label="Active Deliveries"
          value={formatNumber(activeShipments.length)}
          icon={Truck}
          iconClass="bg-success/10 text-success"
          trend={{ value: "live", direction: "neutral" }}
          footer="in transit now"
        />
        {/* <StatCard
          label="Drivers Online"
          value={`${driversOnline.length}/${drivers.data?.length ?? 0}`}
          icon={CircleDot}
          iconClass="bg-chart-4/10 text-chart-4"
          trend={{ value: "live", direction: "neutral" }}
          footer="on duty"
        /> */}
        <StatCard
          label="Pending POD"
          value={pendingPod.length}
          icon={ClipboardCheck}
          iconClass="bg-warning/10 text-warning"
          trend={{ value: "awaiting", direction: "neutral" }}
          footer="proof of delivery"
        />
        {/* <StatCard
          label="Notifications Sent"
          value={formatNumber(totalNotifSent)}
          icon={Bell}
          iconClass="bg-chart-3/10 text-chart-3"
          trend={{
            value: `${avgOpenRate.toFixed(1)}%`,
            direction: "up",
            positive: true,
          }}
          footer="avg open rate"
        /> */}
      </div>

      {/* Map + Service Health */}
      {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex h-2 w-2 animate-pulse-soft rounded-full bg-success" />
                  Live Operations Map
                </CardTitle>
                <CardDescription>
                  Real-time fleet & shipment positions
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/app/live-map">
                  Expand <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[360px]">
              <MapView
                points={vehiclePoints}
                zoom={4}
                className="!rounded-none h-[360px]"
              />
            </div>
            <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                Active ({activeVehicles.length})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-warning" />
                Idle
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                Alert ({exceptions.length})
              </span>
              <span className="ml-auto text-muted-foreground">
                Updated {timeAgo(new Date().toISOString())}
              </span>
            </div>
          </CardContent>
        </Card> */}

        {/* <Card> */}
        {/* <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Gauge className="h-4 w-4 text-primary" />
                Service Health
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                {operationalMs}/{totalMs} OK
              </Badge>
            </div>
          </CardHeader> */}
        {/* <CardContent className="space-y-2.5">
            {microservices.data?.slice(0, 6).map((ms) => (
              <div
                key={ms.id}
                className="flex items-center justify-between rounded-lg border border-border p-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md",
                      ms.status === "operational" &&
                        "bg-success/10 text-success",
                      ms.status === "degraded" && "bg-warning/15 text-warning",
                      ms.status === "down" &&
                        "bg-destructive/10 text-destructive",
                      ms.status === "maintenance" &&
                        "bg-muted text-muted-foreground",
                    )}
                  >
                    {ms.status === "operational" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : ms.status === "maintenance" ? (
                      <Clock className="h-3.5 w-3.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{ms.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {ms.latencyMs}ms · {ms.requestsPerMin.toLocaleString()}
                      /min
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold capitalize",
                    ms.status === "operational" && "text-success",
                    ms.status === "degraded" && "text-warning",
                    ms.status === "down" && "text-destructive",
                    ms.status === "maintenance" && "text-muted-foreground",
                  )}
                >
                  {ms.status}
                </span>
              </div>
            ))}
            {degradedMs > 0 && (
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-2.5 text-xs text-warning">
                <AlertTriangle className="mr-1.5 inline h-3.5 w-3.5" />
                {degradedMs} service(s) need attention
              </div>
            )}
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/app/system-monitoring">View all services</Link>
            </Button>
          </CardContent> */}
        {/* </Card> */}
      {/* </div> */}

      {/* Charts */}
      {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Shipment Status Distribution</CardTitle>
                <CardDescription>
                  Current shipment breakdown by status
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Activity className="h-3 w-3" /> Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={analytics.data?.statusDistribution}
                layout="vertical"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "hsl(var(--muted))" }}
                />
                <Bar dataKey="value" name="Shipments" radius={[0, 6, 6, 0]}>
                  {analytics.data?.statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
      {/* 
        <Card>
          <CardHeader>
            <CardTitle>Transport Modes</CardTitle>
            <CardDescription>Shipments by mode</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={analytics.data?.modeSplit}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {analytics.data?.modeSplit.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={<ChartTooltip formatter={(v) => `${v}%`} />}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(v) => (
                    <span className="text-xs text-muted-foreground">{v}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div> */}

      {/* Activity + Microservice Monitor */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Delivery Activity</CardTitle>
            <CardDescription>Deliveries and pickups by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={analytics.data?.deliveryTrend24h}>
                <defs>
                  <linearGradient id="gdel" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="gpick" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--chart-6))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--chart-6))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="deliveries"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2.5}
                  fill="url(#gdel)"
                  name="Deliveries"
                />
                <Area
                  type="monotone"
                  dataKey="pickups"
                  stroke="hsl(var(--chart-6))"
                  strokeWidth={2.5}
                  fill="url(#gpick)"
                  name="Pickups"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                Microservice Monitor
              </CardTitle>
              <Link
                to="/app/system-monitoring"
                className="text-xs font-medium text-primary hover:underline"
              >
                Details
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "API Latency",
                  value: "124ms",
                  icon: Zap,
                  status: "ok",
                },
                {
                  label: "Error Rate",
                  value: "0.04%",
                  icon: AlertTriangle,
                  status: "ok",
                },
                { label: "CPU Avg", value: "58%", icon: Cpu, status: "ok" },
                { label: "Memory", value: "64%", icon: Database, status: "ok" },
                {
                  label: "Network",
                  value: "320 Mbps",
                  icon: Network,
                  status: "ok",
                },
                {
                  label: "Queue",
                  value: "142 msgs",
                  icon: Gauge,
                  status: "warn",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-lg border border-border p-3"
                >
                  <div className="flex items-center justify-between">
                    <m.icon className="h-4 w-4 text-muted-foreground" />
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        m.status === "ok" ? "bg-success" : "bg-warning",
                      )}
                    />
                  </div>
                  <p className="mt-2 text-lg font-bold">{m.value}</p>
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* {/* Activity Feed + Shipments */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Activity Feed</CardTitle>
              <Link
                to="/app/audit-logs"
                className="text-xs font-medium text-primary hover:underline"
              >
                Audit logs
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-[320px] overflow-y-auto scrollbar-thin">
              {activity.data?.slice(0, 7).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-muted/40"
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      a.type === "alert" &&
                        "bg-destructive/10 text-destructive",
                      a.type === "shipment" && "bg-primary/10 text-primary",
                      a.type === "support" && "bg-chart-6/10 text-chart-6",
                      a.type === "billing" && "bg-chart-4/10 text-chart-4",
                    )}
                  >
                    {a.type === "alert" && (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    {a.type === "shipment" && <Package className="h-4 w-4" />}
                    {a.type === "support" && (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {a.type === "billing" && <Users className="h-4 w-4" />}
                  </span>
                  <p className="flex-1 text-sm text-foreground">
                    <span className="font-semibold">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-mono text-xs font-semibold">
                      {a.target}
                    </span>
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {timeAgo(a.time)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>  */}

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