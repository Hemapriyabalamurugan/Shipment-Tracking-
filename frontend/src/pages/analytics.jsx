
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

const formatDateForApi = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};



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

