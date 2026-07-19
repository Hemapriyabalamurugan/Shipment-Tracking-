
import { useAnalytics } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ChartTooltip } from "@/components/shared/brand-backdrop";
import { LoadingState } from "@/components/shared/states";
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
import { BarChart3, TrendingUp, Percent, Truck, Award } from "lucide-react";

export function AnalyticsPage() {
  const analytics = useAnalytics();

  if (analytics.isLoading) {
    return (
      <div>
        <PageHeader
          title="Analytics"
          description="Performance & delivery insights"
          icon={BarChart3}
        />
        <LoadingState />
      </div>
    );
  }

  const data = analytics.data;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Analytics"
        description="Delivery performance & operational insights"
        icon={BarChart3}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="On-Time Rate"
          value="96.8%"
          icon={Percent}
          iconClass="bg-success/10 text-success"
          trend={{ value: "+1.2%", direction: "up", positive: true }}
          footer="this week"
        />
        <StatCard
          label="Total Shipments"
          value="2,050"
          icon={Truck}
          iconClass="bg-primary/10 text-primary"
          trend={{ value: "+7.3%", direction: "up", positive: true }}
          footer="this month"
        />
        <StatCard
          label="Avg Transit Time"
          value="2.4 days"
          icon={TrendingUp}
          iconClass="bg-chart-6/10 text-chart-6"
          trend={{ value: "-0.3d", direction: "down", positive: true }}
          footer="faster"
        />
        {/* <StatCard
          label="Carrier Score"
          value="A+"
          icon={Award}
          iconClass="bg-chart-4/10 text-chart-4"
          footer="top quartile"
        /> */}
      </div>

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
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Transport Modes</CardTitle>
            <CardDescription>Distribution by mode</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.modeSplit}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {data.modeSplit.map((e, i) => (
                    <Cell key={i} fill={e.color} />
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
        </Card> */}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>On-Time Performance</CardTitle>
            <CardDescription>Weekly delivery rate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.onTimeRate}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  domain={[90, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  content={<ChartTooltip formatter={(v) => `${v}%`} />}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                  name="On-time %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Carrier Performance</CardTitle>
            <CardDescription>On-time % by carrier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.carrierPerformance} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[80, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  type="category"
                  dataKey="carrier"
                  width={120}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  content={<ChartTooltip formatter={(v) => `${v}%`} />}
                  cursor={{ fill: "hsl(var(--muted))" }}
                />
                <Bar
                  dataKey="onTime"
                  name="On-time %"
                  radius={[0, 6, 6, 0]}
                  fill="hsl(var(--chart-1))"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Operational Performance</CardTitle>
          <CardDescription>Key stage completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart
              data={data.performance}
              innerRadius="25%"
              outerRadius="100%"
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={8} background>
                {data.performance.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      [
                        "hsl(var(--chart-1))",
                        "hsl(var(--chart-2))",
                        "hsl(var(--chart-6))",
                        "hsl(var(--chart-4))",
                      ][i]
                    }
                  />
                ))}
              </RadialBar>
              <Legend
                iconType="circle"
                formatter={(v) => (
                  <span className="text-xs text-muted-foreground">{v}</span>
                )}
              />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}
    </div>
  );
}