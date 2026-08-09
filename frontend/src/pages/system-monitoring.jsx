
// import { useMicroservices, useSystemMetrics } from "@/lib/hooks";
// import { PageHeader } from "@/components/shared/page-header";
// import { ChartTooltip } from "@/components/shared/brand-backdrop";
// import { LoadingState } from "@/components/shared/states";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { cn, timeAgo } from "@/lib/utils";
// import {
//   Activity,
//   Server,
//   Cpu,
//   Database,
//   Network,
//   Zap,
//   Gauge,
//   CheckCircle2,
//   AlertTriangle,
//   Clock,
//   XCircle,
//   RefreshCw,
// } from "lucide-react";
// import {
//   Area,
//   AreaChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Line,
//   LineChart,
// } from "recharts";

// const statusMeta = {
//   operational: {
//     label: "Operational",
//     class: "bg-success/10 text-success",
//     icon: CheckCircle2,
//     dot: "bg-success",
//   },
//   degraded: {
//     label: "Degraded",
//     class: "bg-warning/15 text-warning",
//     icon: AlertTriangle,
//     dot: "bg-warning",
//   },
//   down: {
//     label: "Down",
//     class: "bg-destructive/10 text-destructive",
//     icon: XCircle,
//     dot: "bg-destructive",
//   },
//   maintenance: {
//     label: "Maintenance",
//     class: "bg-muted text-muted-foreground",
//     icon: Clock,
//     dot: "bg-muted-foreground",
//   },
// };

// const metricIcons = {
//   "CPU Usage": Cpu,
//   "Memory Usage": Database,
//   "Disk I/O": Database,
//   "Network In": Network,
//   "API Error Rate": AlertTriangle,
//   "Queue Depth": Gauge,
//   "DB Connections": Database,
//   "Cache Hit Rate": Zap,
// };

// export function SystemMonitoringPage() {
//   const { data: services, isLoading: svcLoading } = useMicroservices();
//   const { data: metrics, isLoading: metricLoading } = useSystemMetrics();
//   const isLoading = svcLoading || metricLoading;

//   const operational =
//     services?.filter((s) => s.status === "operational").length ?? 0;
//   const total = services?.length ?? 0;
//   const avgLatency = services?.length
//     ? Math.round(
//         services.reduce((s, m) => s + m.latencyMs, 0) / services.length,
//       )
//     : 0;
//   const totalReqs = services?.reduce((s, m) => s + m.requestsPerMin, 0) ?? 0;

//   const historyData =
//     metrics?.[0]?.history.map((_, i) => {
//       const point = { time: `${i * 5}m` };
//       metrics.forEach((m) => {
//         point[m.name] = m.history[i];
//       });
//       return point;
//     }) ?? [];

//   if (isLoading) {
//     return (
//       <div>
//         <PageHeader
//           title="System Monitoring"
//           description="Real-time microservice & infrastructure health"
//           icon={Activity}
//         />
//         <LoadingState />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <PageHeader
//         title="System Monitoring"
//         description="Real-time microservice & infrastructure health"
//         icon={Activity}
//         actions={
//           <Badge variant="secondary" className="gap-1.5">
//             <RefreshCw className="h-3 w-3 animate-spin-slow" />
//             Auto-refresh 5s
//           </Badge>
//         }
//       />

//       <div className="flex items-center justify-between rounded-2xl border border-success/30 bg-success/5 p-4">
//         <div className="flex items-center gap-3">
//           <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
//             <CheckCircle2 className="h-5 w-5" />
//           </span>
//           <div>
//             <p className="font-semibold text-foreground">
//               Platform Health: Operational
//             </p>
//             <p className="text-xs text-muted-foreground">
//               {operational}/{total} services operational · avg latency{" "}
//               {avgLatency}
//               ms · {totalReqs.toLocaleString()} req/min
//             </p>
//           </div>
//         </div>
//         <div className="hidden gap-6 sm:flex">
//           <div className="text-center">
//             <p className="text-2xl font-bold text-success">{operational}</p>
//             <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
//               Healthy
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-2xl font-bold text-warning">
//               {services?.filter((s) => s.status === "degraded").length ?? 0}
//             </p>
//             <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
//               Degraded
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-2xl font-bold text-muted-foreground">
//               {services?.filter((s) => s.status === "maintenance").length ?? 0}
//             </p>
//             <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
//               Maintenance
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {metrics?.map((m) => {
//           const Icon = metricIcons[m.name] ?? Gauge;
//           return (
//             <Card key={m.name}>
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
//                     <Icon className="h-4 w-4" />
//                   </span>
//                   <span
//                     className={cn(
//                       "h-2 w-2 rounded-full",
//                       m.status === "ok"
//                         ? "bg-success"
//                         : m.status === "warn"
//                           ? "bg-warning"
//                           : "bg-destructive",
//                     )}
//                   />
//                 </div>
//                 <p className="mt-3 text-2xl font-bold">
//                   {m.value}
//                   <span className="ml-1 text-sm font-normal text-muted-foreground">
//                     {m.unit}
//                   </span>
//                 </p>
//                 <p className="text-xs text-muted-foreground">{m.name}</p>
//                 <div className="mt-2 h-8">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={m.history.map((v, i) => ({ i, v }))}>
//                       <defs>
//                         <linearGradient
//                           id={`g-${m.name}`}
//                           x1="0"
//                           y1="0"
//                           x2="0"
//                           y2="1"
//                         >
//                           <stop
//                             offset="0%"
//                             stopColor={
//                               m.status === "ok"
//                                 ? "hsl(var(--success))"
//                                 : "hsl(var(--warning))"
//                             }
//                             stopOpacity={0.3}
//                           />
//                           <stop
//                             offset="100%"
//                             stopColor={
//                               m.status === "ok"
//                                 ? "hsl(var(--success))"
//                                 : "hsl(var(--warning))"
//                             }
//                             stopOpacity={0}
//                           />
//                         </linearGradient>
//                       </defs>
//                       <Area
//                         type="monotone"
//                         dataKey="v"
//                         stroke={
//                           m.status === "ok"
//                             ? "hsl(var(--success))"
//                             : "hsl(var(--warning))"
//                         }
//                         strokeWidth={1.5}
//                         fill={`url(#g-${m.name})`}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Server className="h-4 w-4 text-primary" />
//             Microservices
//           </CardTitle>
//           <CardDescription>
//             {total} services across the platform
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             {services?.map((ms) => {
//               const StatusIcon = statusMeta[ms.status].icon;
//               return (
//                 <Card
//                   key={ms.id}
//                   className={cn(
//                     "border-l-4",
//                     ms.status === "operational"
//                       ? "border-l-success"
//                       : ms.status === "degraded"
//                         ? "border-l-warning"
//                         : ms.status === "down"
//                           ? "border-l-destructive"
//                           : "border-l-muted",
//                   )}
//                 >
//                   <CardContent className="p-4">
//                     <div className="flex items-start justify-between">
//                       <div className="min-w-0">
//                         <p className="truncate text-sm font-semibold">
//                           {ms.name}
//                         </p>
//                         <p className="text-[10px] text-muted-foreground">
//                           {ms.version}
//                         </p>
//                       </div>
//                       <span
//                         className={cn(
//                           "flex h-7 w-7 items-center justify-center rounded-md",
//                           statusMeta[ms.status].class,
//                         )}
//                       >
//                         <StatusIcon className="h-3.5 w-3.5" />
//                       </span>
//                     </div>
//                     <p className="mt-2 text-[11px] text-muted-foreground">
//                       {ms.description}
//                     </p>
//                     <div className="mt-3 space-y-1.5 text-xs">
//                       <div className="flex justify-between">
//                         <span className="text-muted-foreground">Latency</span>
//                         <span className="font-semibold">{ms.latencyMs}ms</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-muted-foreground">Uptime</span>
//                         <span className="font-semibold text-success">
//                           {ms.uptimePct}%
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-muted-foreground">Req/min</span>
//                         <span className="font-semibold">
//                           {ms.requestsPerMin.toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-muted-foreground">
//                           Error rate
//                         </span>
//                         <span
//                           className={cn(
//                             "font-semibold",
//                             ms.errorRatePct > 0.5 && "text-destructive",
//                           )}
//                         >
//                           {ms.errorRatePct}%
//                         </span>
//                       </div>
//                     </div>
//                     <div className="mt-3 grid grid-cols-2 gap-2">
//                       <div>
//                         <div className="flex justify-between text-[10px] text-muted-foreground">
//                           <span>CPU</span>
//                           <span>{ms.cpuPct}%</span>
//                         </div>
//                         <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-muted">
//                           <div
//                             className={cn(
//                               "h-full rounded-full",
//                               ms.cpuPct > 85
//                                 ? "bg-destructive"
//                                 : ms.cpuPct > 70
//                                   ? "bg-warning"
//                                   : "bg-success",
//                             )}
//                             style={{ width: `${ms.cpuPct}%` }}
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex justify-between text-[10px] text-muted-foreground">
//                           <span>Mem</span>
//                           <span>{ms.memoryPct}%</span>
//                         </div>
//                         <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-muted">
//                           <div
//                             className={cn(
//                               "h-full rounded-full",
//                               ms.memoryPct > 85
//                                 ? "bg-destructive"
//                                 : ms.memoryPct > 70
//                                   ? "bg-warning"
//                                   : "bg-success",
//                             )}
//                             style={{ width: `${ms.memoryPct}%` }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <p className="mt-2 border-t border-border pt-2 text-[10px] text-muted-foreground/70">
//                       Deployed {timeAgo(ms.lastDeploy)}
//                     </p>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Infrastructure Trends</CardTitle>
//           <CardDescription>Last 35 minutes · all metrics</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={280}>
//             <LineChart data={historyData}>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="hsl(var(--border))"
//                 vertical={false}
//               />
//               <XAxis
//                 dataKey="time"
//                 tickLine={false}
//                 axisLine={false}
//                 tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
//               />
//               <YAxis
//                 tickLine={false}
//                 axisLine={false}
//                 tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
//               />
//               <Tooltip content={<ChartTooltip />} />
//               {metrics?.slice(0, 4).map((m, i) => (
//                 <Line
//                   key={m.name}
//                   type="monotone"
//                   dataKey={m.name}
//                   stroke={
//                     [
//                       "hsl(var(--chart-1))",
//                       "hsl(var(--chart-2))",
//                       "hsl(var(--chart-6))",
//                       "hsl(var(--chart-4))",
//                     ][i]
//                   }
//                   strokeWidth={2}
//                   dot={false}
//                 />
//               ))}
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }