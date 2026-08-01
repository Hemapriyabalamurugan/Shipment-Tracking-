// import { useAnalytics } from "@/lib/hooks";
import { useAnalytics, useBusinessAnalytics } from "@/lib/hooks";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ChartTooltip } from "@/components/shared/brand-backdrop";
import { LoadingState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { analyticsApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
// import { BarChart3, TrendingUp, Percent, Truck, Award } from "lucide-react";
import {
  BarChart3,
  Package,
  CheckCircle,
  Truck,
  AlertTriangle,
  Clock,
} from "lucide-react";

function AdminAnalyticsPage() {
  const { user } = useAuth();
  // const analytics = useAnalytics();
  const today = new Date();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [startDate, setStartDate] = useState(formatDateForApi(sevenDaysAgo));

  const [endDate, setEndDate] = useState(formatDateForApi(today));
   const analytics = useAnalytics(startDate, endDate);

  return  <AnalyticsContent
      analytics={analytics}
      user={user}
      startDate={startDate}
      endDate={endDate}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
    />;
}



function BusinessAnalyticsPage() {
  const { user } = useAuth();

  const today = new Date();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [startDate, setStartDate] = useState(formatDateForApi(sevenDaysAgo));

  const [endDate, setEndDate] = useState(formatDateForApi(today));

  const analytics = useBusinessAnalytics(user.id, startDate, endDate);

  return (
    <AnalyticsContent
      analytics={analytics}
      user={user}
      startDate={startDate}
      endDate={endDate}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
    />
  );
}
// =========================================================
const formatDateForApi = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
// =================================================


function AnalyticsContent({
  analytics,
  user,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) {
 
  const data = analytics.data;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Analytics"
        description="Delivery performance & operational insights"
        icon={BarChart3}
        // actions={
        //   <Button
        //     onClick={async () => {
        //       // const blob =
        //       //   user.role === "admin"
        //       //     ? await analyticsApi.exportPdf()
        //       //     : await analyticsApi.exportBusinessPdf(user.id);

        //       const blob =
        //         user.role === "admin"
        //           ? await analyticsApi.exportPdf(startDate, endDate)
        //           : await analyticsApi.exportBusinessPdf(
        //               user.id,
        //               startDate,
        //               endDate,
        //             );

        //       const url = window.URL.createObjectURL(blob);

        //       const link = document.createElement("a");
        //       link.href = url;
        //       link.download = "analytics-report.pdf";
        //       link.click();

        //       window.URL.revokeObjectURL(url);
        //     }}
        //   >
        //     Export PDF
        //   </Button>
        // }

        actions={
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            />

            <span className="text-sm text-muted-foreground">to</span>

            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            />

            <Button
              onClick={async () => {
                const blob =
                  user.role === "admin"
                    ? await analyticsApi.exportPdf(startDate, endDate)
                    : await analyticsApi.exportBusinessPdf(
                        user.id,
                        startDate,
                        endDate,
                      );

                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = "analytics-report.pdf";
                link.click();

                window.URL.revokeObjectURL(url);
              }}
            >
              Export PDF
            </Button>
          </div>
        }
      />

      {analytics.isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Overview KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              label="Total Shipments"
              value={(data?.overview?.totalShipments ?? 0).toLocaleString()}
              icon={Package}
              iconClass="bg-primary/10 text-primary"
            />

            <StatCard
              label="Delivered"
              value={(data?.overview?.delivered ?? 0).toLocaleString()}
              icon={CheckCircle}
              iconClass="bg-success/10 text-success"
            />

            <StatCard
              label="In Transit"
              value={(data?.overview?.inTransit ?? 0).toLocaleString()}
              icon={Truck}
              iconClass="bg-primary/10 text-primary"
            />

            <StatCard
              label="Failed Deliveries"
              value={(data?.overview?.failedDeliveries ?? 0).toLocaleString()}
              icon={AlertTriangle}
              iconClass="bg-destructive/10 text-destructive"
            />

            <StatCard
              label="On-Time Delivery"
              value={`${(data?.overview?.onTimeRate ?? 0).toFixed(1)}%`}
              icon={Clock}
              iconClass="bg-chart-6/10 text-chart-6"
            />
          </div>
          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="On-Time Rate"
          value={`${data.onTimeRate}%`}
          icon={Percent}
          iconClass="bg-success/10 text-success"
          trend={{ value: "+1.2%", direction: "up", positive: true }}
          footer="this week"
        />
        <StatCard
          label="Total Shipments"
          value={data.totalShipments}
          icon={Truck}
          iconClass="bg-primary/10 text-primary"
          trend={{ value: "+7.3%", direction: "up", positive: true }}
          footer="this month"
        />
        <StatCard
          label="Avg Transit Time"
          value={`${data.averageTransitDays} days`}
          icon={TrendingUp}
          iconClass="bg-chart-6/10 text-chart-6"
          trend={{ value: "-0.3d", direction: "down", positive: true }}
          footer="faster"
        />
      </div> */}
          {/* <StatCard
          label="Carrier Score"
          value="A+"
          icon={Award}
          iconClass="bg-chart-4/10 text-chart-4"
          footer="top quartile"
        /> */}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* <Card> */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>24-Hour Delivery Activity</CardTitle>
                <CardDescription>
                  Deliveries and pickups by hour
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={analytics.data?.deliveryActivity24h ?? []}>
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
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="linear"
                      dataKey="deliveries"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2.5}
                      fill="url(#gdel)"
                      name="Deliveries"
                    />
                    <Area
                      type="linear"
                      dataKey="pickups"
                      stroke="hsl(var(--chart-6))"
                      strokeWidth={2.5}
                      fill="url(#gpick)"
                      name="Pickups"
                    />
                  </AreaChart>
                </ResponsiveContainer> */}

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.deliveryActivity24h}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="hour"
                      tickFormatter={(hour) =>
                        `${String(hour).padStart(2, "0")}:00`
                      }
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip
                      labelFormatter={(hour) =>
                        `${String(hour).padStart(2, "0")}:00`
                      }
                    />

                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="deliveries"
                      name="Deliveries"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                    />

                    <Line
                      type="monotone"
                      dataKey="pickups"
                      name="Pickups"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Performance</CardTitle>
                  <CardDescription>
                    On-time vs Delayed vs Failed Deliveries
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={[
                        {
                          name: "On Time",
                          value:
                            analytics.data?.deliveryPerformance?.onTime ?? 0,
                        },
                        {
                          name: "Delayed",
                          value:
                            analytics.data?.deliveryPerformance?.delayed ?? 0,
                        },
                        {
                          name: "Failed",
                          value:
                            analytics.data?.deliveryPerformance?.failed ?? 0,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div> */}

            {/* Delivery Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
                <CardDescription>Performance breakdown</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-6">
                  {/* On-Time Percentage */}
                  <div className="flex items-center justify-center">
                    <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-[14px] border-green-500">
                      <span className="text-3xl font-bold">
                        {(data?.overview?.onTimeRate ?? 0).toFixed(1)}%
                      </span>

                      <span className="text-sm text-muted-foreground">
                        On-Time
                      </span>
                    </div>
                  </div>

                  {/* Performance Breakdown */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        <span className="text-sm">On Time</span>
                      </div>

                      <span className="font-semibold">
                        {data?.deliveryPerformance?.onTime ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                        <span className="text-sm">Delayed</span>
                      </div>

                      <span className="font-semibold">
                        {data?.deliveryPerformance?.delayed ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        <span className="text-sm">Failed</span>
                      </div>

                      <span className="font-semibold">
                        {data?.deliveryPerformance?.failed ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Statistics */}
                  <div className="grid grid-cols-2 gap-3 border-t pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Avg. Delivery Time
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {Math.floor(
                          (data?.deliveryPerformance?.averageDeliveryMinutes ??
                            0) / 1440,
                        )}
                        d{" "}
                        {Math.floor(
                          ((data?.deliveryPerformance?.averageDeliveryMinutes ??
                            0) %
                            1440) /
                            60,
                        )}
                        h
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Success Rate
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {(data?.deliveryPerformance?.successRate ?? 0).toFixed(
                          1,
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Volume & Delivery trend */}
          {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-3"> */}
          {/* <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    
                    <CardTitle>Delivery Volume Trend</CardTitle>
                    <CardDescription>
                      Shipment volume for selected date range
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data?.deliveryVolumeTrend ?? []}>
                    <defs>
                      <linearGradient
                        id="volumeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.03}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => {
                        const [, month, day] = date.split("-");
                        return `${day}/${month}`;
                      }}
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip
                      labelFormatter={(date) => {
                        const [year, month, day] = date.split("-");
                        return `${day}/${month}/${year}`;
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="shipments"
                      name="Shipments"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#volumeGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card> */}

          {/* Bottom Analytics Row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Shipment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Shipments by Status</CardTitle>
                <CardDescription>
                  Distribution of shipment statuses
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={data?.shipmentStatus ?? []}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {(data?.shipmentStatus ?? []).map((entry, index) => {
                        const colors = [
                          "#22c55e",
                          "#3b82f6",
                          "#ef4444",
                          "#f59e0b",
                        ];

                        return (
                          <Cell
                            key={`${entry.status}-${index}`}
                            fill={colors[index % colors.length]}
                          />
                        );
                      })}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {(data?.shipmentStatus ?? []).map((item, index) => {
                    const colors = ["#22c55e", "#3b82f6", "#ef4444", "#f59e0b"];

                    return (
                      <div
                        key={item.status}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />

                          <span>
                            {item.status
                              .replaceAll("_", " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        </div>

                        <span className="font-semibold">{item.count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Routes */}
            <Card>
              <CardHeader>
                <CardTitle>Top Routes by Volume</CardTitle>
                <CardDescription>
                  Most frequently used shipment routes
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-5">
                  {(data?.topRoutes ?? []).map((route) => {
                    const maxShipments = Math.max(
                      ...(data?.topRoutes ?? []).map((item) => item.shipments),
                      1,
                    );

                    const width = (route.shipments / maxShipments) * 100;

                    return (
                      <div
                        key={`${route.origin}-${route.destination}`}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="truncate">
                            {route.origin} → {route.destination}
                          </span>

                          <span className="font-semibold">
                            {route.shipments}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Volume Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Volume Trend</CardTitle>
                <CardDescription>
                  Shipment volume for selected date range
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  {/* <AreaChart data={data?.deliveryVolumeTrend ?? []}>
                   */}
                  <AreaChart
                    data={data?.deliveryVolumeTrend ?? []}
                    margin={{
                      top: 5,
                      right: 1,
                      bottom: 5,
                      left: -40,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="volumeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.35}
                        />

                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.03}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => {
                        const [, month, day] = date.split("-");
                        return `${day}/${month}`;
                      }}
                    />

                    <YAxis allowDecimals={false}  />

                    <Tooltip
                      labelFormatter={(date) => {
                        const [year, month, day] = date.split("-");

                        return `${day}/${month}/${year}`;
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="shipments"
                      name="Shipments"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#volumeGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          {/* </div> */}

          {/* average delivery time */}

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
                  <LineChart data={analytics.data?.averageDeliveryTime ?? []}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <YAxis
                      domain={[2, 4]}
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "hsl(var(--muted-foreground))",
                      }}
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
          {/*
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Volume & Delivery Trend</CardTitle>
            <CardDescription>
              Monthly shipments vs successful deliveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.volumeByMonth}>
                <defs>
                  <linearGradient id="av1" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="av2" x1="0" y1="0" x2="0" y2="1">
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
                </defs>
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
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="shipments"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2.5}
                  fill="url(#av1)"
                  name="Shipments"
                />
                <Area
                  type="monotone"
                  dataKey="delivered"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2.5}
                  fill="url(#av2)"
                  name="Delivered"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

          {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>On-Time Performance</CardTitle>
                <CardDescription>Weekly delivery rate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  {/* <LineChart data={data.onTimeRate}> */}
          {/* <LineChart data={data.onTimePerformance ?? []}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    /> */}
          {/* <XAxis
                      dataKey="week"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    /> */}
          {/* <YAxis
                      domain={[90, 100]}
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    /> */}
          {/* <Tooltip
                      content={<ChartTooltip formatter={(v) => `${v}%`} />}
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                      name="On-time %"
                    /> */}
          {/* </LineChart>
                </ResponsiveContainer>
              </CardContent> */}
          {/* </Card> */}
          {/* </div> */}

          {/* =================================================new block ============================================== */}

          {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Status</CardTitle>
                <CardDescription>
                  Distribution of shipment statuses
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={analytics.data?.shipmentStatus ?? []}
                      dataKey="count"
                      nameKey="status"
                      outerRadius={90}
                      label
                    />
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div> */}

          {/* <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Routes</CardTitle>
                <CardDescription>
                  Most frequently used shipment routes
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.data?.topRoutes ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="origin"
                      tickFormatter={(value, index) => {
                        const route = analytics.data?.topRoutes?.[index];
                        return route
                          ? `${route.origin} → ${route.destination}`
                          : value;
                      }}
                    />
                    <YAxis />

                    <Tooltip
                      content={<ChartTooltip />}
                      formatter={(value) => [value, "Shipments"]}
                      labelFormatter={(_, payload) => {
                        if (!payload?.length) return "";
                        const route = payload[0].payload;
                        return `${route.origin} → ${route.destination}`;
                      }}
                    />
                    <Bar dataKey="shipments" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div> */}
        </>
      )}
    </div>
  );
}

export function AnalyticsPage() {
  const { user } = useAuth();
  console.log(user);

  return user.role === "admin" ? (
    <AdminAnalyticsPage />
  ) : (
    <BusinessAnalyticsPage />
  );
}

// import { useAnalytics, useBusinessAnalytics } from "@/lib/hooks";
// import { useAuth } from "@/context/auth-context";
// import { PageHeader } from "@/components/shared/page-header";
// import { StatCard } from "@/components/shared/stat-card";
// import { ChartTooltip } from "@/components/shared/brand-backdrop";
// import { LoadingState } from "@/components/shared/states";
// import { Button } from "@/components/ui/button";
// import { analyticsApi } from "@/lib/api";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Area,
//   AreaChart,
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Legend,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import {
//   BarChart3,
//   Package,
//   CheckCircle,
//   Truck,
//   AlertTriangle,
//   Clock,
//   Calendar,
// } from "lucide-react";

// function AdminAnalyticsPage() {
//   const { user } = useAuth();
//   const analytics = useAnalytics();

//   return <AnalyticsContent analytics={analytics} user={user} />;
// }

// function BusinessAnalyticsPage() {
//   const { user } = useAuth();
//   const analytics = useBusinessAnalytics(user.id);

//   return <AnalyticsContent analytics={analytics} user={user} />;
// }

// function AnalyticsContent({ analytics, user }) {
//   /* -------------------------------------------------------------------------- */
//   /*  MOCK DATA FALLBACK & BACKEND MAPPING COMMENTS                            */
//   /* -------------------------------------------------------------------------- */

//   // If analytics.data is empty, we fallback to mock data so the UI renders correctly.
//   // 1. TOTAL SHIPMENTS, DELIVERED, IN TRANSIT, FAILED, ON-TIME RATE
//   //    - Backend needs to provide: number, trendPercent (string like "+16.6%"), trendDirection ("up" or "down")
//   // 2. 24-HOUR DELIVERY ACTIVITY
//   //    - Backend needs to provide: Array of { hour: number (0-23), deliveries: number, pickups: number }
//   // 3. DELIVERY PERFORMANCE (Donut chart + metrics)
//   //    - Backend needs to provide: onTimeCount, delayedCount, failedCount, averageDeliveryTime (string), successRate (string)
//   // 4. SHIPMENTS BY STATUS
//   //    - Backend needs to provide: Array of { status: string, count: number, colorClass: string } for the donut chart
//   // 5. TOP ROUTES BY VOLUME
//   //    - Backend needs to provide: Array of { route: string (e.g. "Bangalore -> Jaipur"), volume: number }
//   // 6. DELIVERY VOLUME TREND
//   //    - Backend needs to provide: Array of { dateLabel: string (e.g. "May 15"), volume: number }

//   const data = analytics.data || {
//     // Top Stats
//     totalShipments: 12548,
//     totalShipmentsTrend: "+16.6%",
//     delivered: 9876,
//     deliveredTrend: "+23.4%",
//     inTransit: 2134,
//     inTransitTrend: "+6.7%",
//     failedDeliveries: 128,
//     failedDeliveriesTrend: "+12.8%",
//     onTimeDelivery: 93.6,
//     onTimeDeliveryTrend: "+5.9%",

//     // 24-Hour Activity (Mock data matching image shape)
//     deliveryActivity24h: Array.from({ length: 24 }, (_, i) => {
//       // Simple mock logic to match the image peaks
//       let deliveries = 0,
//         pickups = 0;
//       if (i >= 7 && i <= 11) deliveries = (i - 6) * 10;
//       if (i >= 12 && i <= 15) deliveries = 50 - (i - 12) * 12;
//       if (i >= 16 && i <= 21) deliveries = (i - 15) * 8;
//       if (i >= 7 && i <= 11) pickups = (i - 5) * 8;
//       if (i >= 12 && i <= 15) pickups = 40 - (i - 12) * 8;
//       if (i >= 16 && i <= 21) pickups = (i - 14) * 10;

//       return {
//         hour: i,
//         deliveries: Math.max(0, Math.round(deliveries)),
//         pickups: Math.max(0, Math.round(pickups)),
//       };
//     }),

//     // Delivery Performance (Donut + metrics)
//     deliveryPerformance: [
//       { name: "On Time", value: 9876, color: "hsl(var(--chart-2))" },
//       { name: "Delayed", value: 542, color: "hsl(var(--chart-5))" },
//       { name: "Failed", value: 128, color: "hsl(var(--chart-4))" },
//     ],
//     avgDeliveryTime: "2h 47m",
//     successRate: "98.7%",

//     // Shipments by Status
//     shipmentsByStatus: [
//       { name: "Delivered", value: 9876, color: "hsl(var(--chart-2))" },
//       { name: "In Transit", value: 2134, color: "hsl(var(--chart-1))" },
//       { name: "Failed", value: 128, color: "hsl(var(--chart-4))" },
//       { name: "Pending", value: 410, color: "hsl(var(--chart-6))" },
//     ],

//     // Top Routes
//     topRoutes: [
//       { route: "Bangalore → Jaipur", volume: 1246 },
//       { route: "Hyderabad → Chennai", volume: 1102 },
//       { route: "Mumbai → Delhi", volume: 987 },
//       { route: "Pune → Mumbai", volume: 876 },
//       { route: "Chennai → Singapore", volume: 765 },
//     ],

//     // Delivery Volume Trend (Last 7 Days)
//     deliveryVolumeTrend: [
//       { date: "May 15", volume: 1456 },
//       { date: "May 16", volume: 1866 },
//       { date: "May 17", volume: 1320 },
//       { date: "May 18", volume: 1016 },
//       { date: "May 19", volume: 1350 },
//       { date: "May 20", volume: 1650 },
//       { date: "May 21", volume: 1995 },
//     ],
//   };

//   // COLORS FOR PIE CHARTS
//   const STATUS_COLORS = [
//     "hsl(var(--chart-2))",
//     "hsl(var(--chart-1))",
//     "hsl(var(--chart-4))",
//     "hsl(var(--chart-6))",
//   ];

//   if (analytics.isLoading) {
//     return (
//       <div>
//         <PageHeader
//           title="Analytics"
//           description="Delivery performance & operational insights"
//           icon={BarChart3}
//           actions={
//             <Button
//               onClick={async () => {
//                 const blob =
//                   user.role === "admin"
//                     ? await analyticsApi.exportPdf()
//                     : await analyticsApi.exportBusinessPdf(user.id);

//                 const url = window.URL.createObjectURL(blob);

//                 const link = document.createElement("a");
//                 link.href = url;
//                 link.download = "analytics-report.pdf";
//                 link.click();

//                 window.URL.revokeObjectURL(url);
//               }}
//             >
//               Export PDF
//             </Button>
//           }
//         />
//         <LoadingState />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* 
//         HEADER SECTION 
//         Data Needed: Date Range (May 15 - July 31, 2026) - currently mocked.
//       */}
//       <PageHeader
//         title="Analytics"
//         description="Delivery performance & operational insights"
//         icon={BarChart3}
//         actions={
//           <div className="flex items-center gap-4">
//             {/* 
//                 BACKEND DATA NEEDED:
//                 - startDate: string (e.g. "May 15, 2026")
//                 - endDate: string (e.g. "July 31, 2026")
//              */}
//             <div className="flex items-center border rounded-md px-3 py-1.5 text-sm bg-background">
//               <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
//               <span>May 15 - July 31, 2026</span>
//             </div>
//             <Button
//               onClick={async () => {
//                 const blob =
//                   user.role === "admin"
//                     ? await analyticsApi.exportPdf()
//                     : await analyticsApi.exportBusinessPdf(user.id);

//                 const url = window.URL.createObjectURL(blob);

//                 const link = document.createElement("a");
//                 link.href = url;
//                 link.download = "analytics-report.pdf";
//                 link.click();

//                 window.URL.revokeObjectURL(url);
//               }}
//             >
//               Export PDF
//             </Button>
//           </div>
//         }
//       />

//       {/* 
//         STATS CARDS SECTION (ROW 1)
//         Required backend data fields for the 5 cards:
//         1. totalShipments: number, totalShipmentsTrend: string
//         2. delivered: number, deliveredTrend: string
//         3. inTransit: number, inTransitTrend: string
//         4. failedDeliveries: number, failedDeliveriesTrend: string
//         5. onTimeDelivery: number, onTimeDeliveryTrend: string
//       */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
//         <StatCard
//           label="Total Shipments"
//           value={data.totalShipments.toLocaleString()}
//           icon={Package}
//           iconClass="bg-primary/10 text-primary"
//           trend={{
//             value: data.totalShipmentsTrend,
//             direction: "up",
//             positive: true,
//           }}
//           footer="vs last week"
//         />
//         <StatCard
//           label="Delivered"
//           value={data.delivered.toLocaleString()}
//           icon={CheckCircle}
//           iconClass="bg-success/10 text-success"
//           trend={{
//             value: data.deliveredTrend,
//             direction: "up",
//             positive: true,
//           }}
//           footer="vs last week"
//         />
//         <StatCard
//           label="In Transit"
//           value={data.inTransit.toLocaleString()}
//           icon={Truck}
//           iconClass="bg-chart-1/10 text-chart-1"
//           trend={{
//             value: data.inTransitTrend,
//             direction: "up",
//             positive: true,
//           }}
//           footer="vs last week"
//         />
//         <StatCard
//           label="Failed Deliveries"
//           value={data.failedDeliveries.toLocaleString()}
//           icon={AlertTriangle}
//           iconClass="bg-destructive/10 text-destructive"
//           trend={{
//             value: data.failedDeliveriesTrend,
//             direction: "up",
//             positive: false,
//           }}
//           footer="vs last week"
//         />
//         <StatCard
//           label="On-Time Delivery"
//           value={`${data.onTimeDelivery}%`}
//           icon={Clock}
//           iconClass="bg-chart-2/10 text-chart-2"
//           trend={{
//             value: data.onTimeDeliveryTrend,
//             direction: "up",
//             positive: true,
//           }}
//           footer="vs last week"
//         />
//       </div>

//       {/* 
//         CHARTS ROW 2 (24-Hour Activity & Delivery Performance)
//         Data Needed:
//         - Left: deliveryActivity24h (array of { hour, deliveries, pickups })
//         - Right: deliveryPerformance (array of { name, value }), avgDeliveryTime (string), successRate (string)
//       */}
//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//         {/* 24-Hour Delivery Activity */}
//         <Card>
//           <CardHeader>
//             <CardTitle>24-Hour Delivery Activity</CardTitle>
//             <CardDescription>Deliveries and pickups by hour</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={240}>
//               <AreaChart data={data.deliveryActivity24h}>
//                 <defs>
//                   <linearGradient id="gdel" x1="0" y1="0" x2="0" y2="1">
//                     <stop
//                       offset="0%"
//                       stopColor="hsl(var(--chart-2))"
//                       stopOpacity={0.3}
//                     />
//                     <stop
//                       offset="100%"
//                       stopColor="hsl(var(--chart-2))"
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                   <linearGradient id="gpick" x1="0" y1="0" x2="0" y2="1">
//                     <stop
//                       offset="0%"
//                       stopColor="hsl(var(--chart-6))"
//                       stopOpacity={0.3}
//                     />
//                     <stop
//                       offset="100%"
//                       stopColor="hsl(var(--chart-6))"
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke="hsl(var(--border))"
//                   vertical={false}
//                 />
//                 <XAxis
//                   dataKey="hour"
//                   tickLine={false}
//                   axisLine={false}
//                   tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
//                 />
//                 <YAxis
//                   tickLine={false}
//                   axisLine={false}
//                   tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
//                 />
//                 <Tooltip content={<ChartTooltip />} />
//                 <Area
//                   type="linear"
//                   dataKey="deliveries"
//                   stroke="hsl(var(--chart-2))"
//                   strokeWidth={2.5}
//                   fill="url(#gdel)"
//                   name="Deliveries"
//                 />
//                 <Area
//                   type="linear"
//                   dataKey="pickups"
//                   stroke="hsl(var(--chart-6))"
//                   strokeWidth={2.5}
//                   fill="url(#gpick)"
//                   name="Pickups"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Delivery Performance Donut Chart */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Delivery Performance</CardTitle>
//             <CardDescription>Performance breakdown</CardDescription>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center">
//             <div className="relative w-full h-[200px] flex items-center justify-center">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={data.deliveryPerformance}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={85}
//                     paddingAngle={2}
//                     dataKey="value"
//                   >
//                     {data.deliveryPerformance.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<ChartTooltip />} />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                 {/* 
//                     DATA NEEDED FOR CENTER LABEL:
//                     - onTimePercent: number (retrieved from the data.deliveryPerformance array)
//                  */}
//                 <span className="text-2xl font-bold">93.6%</span>
//                 <span className="text-xs text-muted-foreground">On-Time</span>
//               </div>
//             </div>

//             {/* Average Delivery Time & Success Rate */}
//             <div className="w-full flex justify-around mt-2 border-t pt-4">
//               <div className="text-center">
//                 {/* 
//                     BACKEND DATA NEEDED HERE:
//                     - avgDeliveryTime: string or number (e.g., "2h 47m" or 2.78h)
//                  */}
//                 <p className="text-xs text-muted-foreground">
//                   Avg. Delivery Time
//                 </p>
//                 <p className="text-sm font-semibold">{data.avgDeliveryTime}</p>
//               </div>
//               <div className="text-center">
//                 {/* 
//                     BACKEND DATA NEEDED HERE:
//                     - successRate: string (e.g., "98.7%")
//                  */}
//                 <p className="text-xs text-muted-foreground">Success Rate</p>
//                 <p className="text-sm font-semibold">{data.successRate}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* 
//         CHARTS ROW 3 (Shipments Status, Top Routes, Volume Trend)
//         Data Needed:
//         - Left: shipmentsByStatus (array of { name, value, color })
//         - Middle: topRoutes (array of { route, volume })
//         - Right: deliveryVolumeTrend (array of { date, volume })
//       */}
//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
//         {/* Shipments by Status */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Shipments by Status</CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center">
//             <div className="relative w-full h-[180px] flex items-center justify-center">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={data.shipmentsByStatus}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={2}
//                     dataKey="value"
//                   >
//                     {data.shipmentsByStatus.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={STATUS_COLORS[index % STATUS_COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<ChartTooltip />} />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                 <span className="text-2xl font-bold">
//                   {data.totalShipments.toLocaleString()}
//                 </span>
//                 <span className="text-xs text-muted-foreground">Total</span>
//               </div>
//             </div>

//             {/* Legend for Shipments by Status */}
//             <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2 w-full max-w-[200px]">
//               {data.shipmentsByStatus.map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="flex items-center justify-between gap-2 text-xs"
//                 >
//                   <div className="flex items-center gap-1.5">
//                     <div
//                       className="w-2 h-2 rounded-full"
//                       style={{
//                         backgroundColor:
//                           STATUS_COLORS[idx % STATUS_COLORS.length],
//                       }}
//                     />
//                     <span className="text-muted-foreground">{item.name}</span>
//                   </div>
//                   <span className="font-medium">
//                     {item.value.toLocaleString()}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Top Routes by Volume */}
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <CardTitle>Top Routes by Volume</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[180px] overflow-y-auto pr-2">
//               {data.topRoutes.map((route, idx) => (
//                 <div key={idx} className="mb-3 last:mb-0">
//                   <div className="flex justify-between text-xs mb-1">
//                     {/* 
//                       BACKEND DATA NEEDED:
//                       - routeName: string
//                       - count: number
//                     */}
//                     <span className="text-muted-foreground">{route.route}</span>
//                     <span className="font-medium">
//                       {route.volume.toLocaleString()}
//                     </span>
//                   </div>
//                   {/* Visual bar representation */}
//                   <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
//                     <div
//                       className="bg-chart-1 h-full rounded-full"
//                       style={{
//                         width: `${Math.min((route.volume / 1500) * 100, 100)}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Delivery Volume Trend */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Delivery Volume Trend</CardTitle>
//             <CardDescription>Last 7 days</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={180}>
//               <AreaChart data={data.deliveryVolumeTrend}>
//                 <defs>
//                   <linearGradient id="vtrend" x1="0" y1="0" x2="0" y2="1">
//                     <stop
//                       offset="0%"
//                       stopColor="hsl(var(--chart-6))"
//                       stopOpacity={0.4}
//                     />
//                     <stop
//                       offset="100%"
//                       stopColor="hsl(var(--chart-6))"
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke="hsl(var(--border))"
//                   vertical={false}
//                   horizontal={true}
//                 />
//                 <XAxis
//                   dataKey="date"
//                   tickLine={false}
//                   axisLine={false}
//                   tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
//                 />
//                 <YAxis
//                   tickLine={false}
//                   axisLine={false}
//                   tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
//                 />
//                 <Tooltip content={<ChartTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="volume"
//                   stroke="hsl(var(--chart-6))"
//                   strokeWidth={2}
//                   fill="url(#vtrend)"
//                   name="Volume"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export function AnalyticsPage() {
//   const { user } = useAuth();

//   return user.role === "admin" ? (
//     <AdminAnalyticsPage />
//   ) : (
//     <BusinessAnalyticsPage />
//   );
// }