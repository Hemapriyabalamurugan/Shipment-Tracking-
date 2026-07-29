
import { useAuth } from "@/context/auth-context";
import { useMyShipments, useInvoices, useBusinessAnalytics } from "@/lib/hooks";
import { StatCard } from "@/components/shared/stat-card";
import { ShipmentTable } from "@/components/shared/shipment-table";
import { ChartTooltip } from "@/components/shared/brand-backdrop";
import { LoadingState } from "@/components/shared/states";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, relativeDay } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Package,
  IndianRupee ,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Clock,
  TrendingUp,
  Truck,
  BarChart3,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default  function BusinessDashboard() {
  const { user } = useAuth();
  const myShipments = useMyShipments(user.id);
  const invoices = useInvoices();
  const analytics = useBusinessAnalytics(user.id);

  const isLoading =
    myShipments.isLoading || analytics.isLoading || invoices.isLoading;

  const allShipments = myShipments.data ?? [];
  const delivered = allShipments.filter((s) => s.status === "delivered");
  const inTransit = allShipments.filter((s) =>
    ["in_transit", "out_for_delivery", "picked_up"].includes(s.status),
  );
  const delayed = allShipments.filter((s) =>
    ["delayed", "exception"].includes(s.status),
  );
  const monthlyCost =
    analytics.data?.businessCostTrend?.slice(-1)[0]?.cost ?? 0;

  // Calculate average delivery time from business data
  const avgDeliveryDays =
    analytics.data?.businessDeliveryTime?.slice(-1)[0]?.avgDays ?? 2.3;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <ExecutiveHeader
          userName={user.name ?? user.firstName}
          company={user.company ?? user.companyName}
        />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ExecutiveHeader
        userName={user.name}
        company={user.company}
        delayedCount={delayed.length}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Shipments"
          value={allShipments.length}
          icon={Package}
          iconClass="bg-primary/10 text-primary"
          // trend={{ value: "+12%", direction: "up", positive: true }}
          // footer="this quarter"
        />
        <StatCard
          label="Delivered"
          value={delivered.length}
          icon={CheckCircle2}
          iconClass="bg-success/10 text-success"
          trend={{
            value: `${Math.round((delivered.length / Math.max(allShipments.length, 1)) * 100)}%`,
            direction: "up",
            positive: true,
          }}
          footer="success rate"
        />
        <StatCard
          label="In Transit"
          value={inTransit.length}
          icon={Truck}
          iconClass="bg-chart-6/10 text-chart-6"
          trend={{ value: "live", direction: "neutral" }}
          footer="active now"
        />
        <StatCard
          label="Delayed"
          value={delayed.length}
          icon={AlertTriangle}
          iconClass={
            delayed.length > 0
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          }
          trend={{
            value: delayed.length > 0 ? "action needed" : "all clear",
            direction: "neutral",
          }}
        />
       
        {/* <StatCard
          label="Avg Delivery Time"
          value={`${avgDeliveryDays} days`}
          icon={Clock}
          iconClass="bg-chart-3/10 text-chart-3"
          // trend={{ value: "-0.3d", direction: "down", positive: true }}
          // footer="faster"
        /> */}
      </div>

      

      

      {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Average Delivery Time</CardTitle>
            <CardDescription>
              Days from pickup to delivery — trending down
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics.data?.businessDeliveryTime}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  domain={[2, 4]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => `${v}d`}
                />
                <Tooltip
                  content={<ChartTooltip formatter={(v) => `${v} days`} />}
                />
                <Line
                  type="monotone"
                  dataKey="avgDays"
                  stroke="hsl(var(--chart-6))"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "hsl(var(--chart-6))" }}
                  name="Avg Days"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div> */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Shipments</CardTitle>
              <CardDescription>All your recent shipments</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/app/shipments">
                  View all <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ShipmentTable
            shipments={allShipments}
            showCustomer={false}
            emptyLabel="No shipments yet"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ExecutiveHeader({ userName, company, delayedCount }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-white shadow-lg shadow-primary/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Executive Dashboard
            </h1>
            {/* <p className="text-sm text-muted-foreground">
              {userName.split(" ")[0]} · {company ?? "Your Company"}
            </p> */}
            <p className="text-sm text-muted-foreground">
              {userName || "User"} · {company ?? "Your Company"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {delayedCount !== undefined && delayedCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" />
              <span className="text-xs font-semibold text-warning">
                {delayedCount} shipment(s) need attention
              </span>
            </div>
          )}
          <Button asChild>
            <Link to="/app/create-shipment">
              <Plus className="mr-2 h-4 w-4" />
              New Shipment
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}