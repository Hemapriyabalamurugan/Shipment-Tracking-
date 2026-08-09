
// import { useEtaPredictions } from "@/lib/hooks";
// import { PageHeader } from "@/components/shared/page-header";
// import { StatCard } from "@/components/shared/stat-card";
// import { ChartTooltip } from "@/components/shared/brand-backdrop";
// import { LoadingState, EmptyState } from "@/components/shared/states";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { cn, relativeDay, formatDateTime } from "@/lib/utils";
// import { Link } from "react-router-dom";
// import {
//   Clock,
//   TrendingUp,
//   AlertTriangle,
//   CheckCircle2,
//   Brain,
//   Gauge,
//   ArrowRight,
// } from "lucide-react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
//   Cell,
// } from "recharts";

// const riskMeta = {
//   low: {
//     label: "Low Risk",
//     class: "bg-success/10 text-success",
//     dot: "bg-success",
//   },
//   medium: {
//     label: "Medium Risk",
//     class: "bg-warning/15 text-warning",
//     dot: "bg-warning",
//   },
//   high: {
//     label: "High Risk",
//     class: "bg-destructive/10 text-destructive",
//     dot: "bg-destructive",
//   },
// };

// export function EtaPredictionPage() {
//   const { data: predictions, isLoading } = useEtaPredictions();

//   if (isLoading) {
//     return (
//       <div>
//         <PageHeader
//           title="ETA Prediction"
//           description="ML-powered delivery time forecasts"
//           icon={Clock}
//         />
//         <LoadingState />
//       </div>
//     );
//   }

//   const highRisk = predictions?.filter((p) => p.riskLevel === "high") ?? [];
//   const avgConfidence = predictions?.length
//     ? predictions.reduce((s, p) => s + p.confidencePct, 0) / predictions.length
//     : 0;
//   const onTime = predictions?.filter((p) => p.delayMinutes === 0).length ?? 0;
//   const delayed = predictions?.filter((p) => p.delayMinutes > 0).length ?? 0;

//   const chartData =
//     predictions?.map((p) => ({
//       name: p.trackingNumber.split("-").pop(),
//       confidence: p.confidencePct,
//       delay: p.delayMinutes,
//       risk: p.riskLevel,
//     })) ?? [];

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <PageHeader
//         title="ETA Prediction"
//         description="AI-powered delivery time forecasting & risk assessment"
//         icon={Clock}
//       />

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           label="Avg Confidence"
//           value={`${avgConfidence.toFixed(1)}%`}
//           icon={Brain}
//           iconClass="bg-primary/10 text-primary"
//         />
//         <StatCard
//           label="On-Time Predictions"
//           value={onTime}
//           icon={CheckCircle2}
//           iconClass="bg-success/10 text-success"
//         />
//         <StatCard
//           label="Delayed Predictions"
//           value={delayed}
//           icon={AlertTriangle}
//           iconClass="bg-warning/10 text-warning"
//         />
//         <StatCard
//           label="High Risk"
//           value={highRisk.length}
//           icon={TrendingUp}
//           iconClass="bg-destructive/10 text-destructive"
//         />
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Prediction Confidence & Delay Analysis</CardTitle>
//           <CardDescription>Per-shipment ML model output</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={chartData}>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="hsl(var(--border))"
//                 vertical={false}
//               />
//               <XAxis
//                 dataKey="name"
//                 tickLine={false}
//                 axisLine={false}
//                 tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
//               />
//               <YAxis
//                 yAxisId="left"
//                 tickLine={false}
//                 axisLine={false}
//                 tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
//               />
//               <YAxis
//                 yAxisId="right"
//                 orientation="right"
//                 tickLine={false}
//                 axisLine={false}
//                 tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
//               />
//               <Tooltip
//                 content={<ChartTooltip />}
//                 cursor={{ fill: "hsl(var(--muted))" }}
//               />
//               <Bar
//                 yAxisId="left"
//                 dataKey="confidence"
//                 name="Confidence %"
//                 radius={[6, 6, 0, 0]}
//               >
//                 {chartData.map((d, i) => (
//                   <Cell
//                     key={i}
//                     fill={
//                       d.risk === "high"
//                         ? "hsl(var(--chart-5))"
//                         : d.risk === "medium"
//                           ? "hsl(var(--chart-3))"
//                           : "hsl(var(--chart-2))"
//                     }
//                   />
//                 ))}
//               </Bar>
//               <Bar
//                 yAxisId="right"
//                 dataKey="delay"
//                 name="Delay (min)"
//                 radius={[6, 6, 0, 0]}
//                 fill="hsl(var(--chart-1))"
//                 fillOpacity={0.5}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Active Predictions</CardTitle>
//           <CardDescription>
//             {predictions?.length} shipments with live ETA forecasts
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {predictions && predictions.length > 0 ? (
//             <div className="overflow-x-auto scrollbar-thin">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-muted/40 hover:bg-muted/40">
//                     <TableHead>Tracking #</TableHead>
//                     <TableHead className="hidden md:table-cell">
//                       Route
//                     </TableHead>
//                     <TableHead>Progress</TableHead>
//                     <TableHead>Predicted ETA</TableHead>
//                     <TableHead className="hidden sm:table-cell">
//                       Confidence
//                     </TableHead>
//                     <TableHead>Delay</TableHead>
//                     <TableHead>Risk</TableHead>
//                     <TableHead className="w-10" />
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {predictions.map((p) => (
//                     <TableRow key={p.id} className="group">
//                       <TableCell>
//                         <Link
//                           to={`/app/shipments/${p.shipmentId}`}
//                           className="font-mono text-xs font-semibold"
//                         >
//                           {p.trackingNumber}
//                         </Link>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
//                         {p.origin} → {p.destination}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
//                             <div
//                               className="h-full rounded-full bg-primary"
//                               style={{ width: `${p.currentProgress}%` }}
//                             />
//                           </div>
//                           <span className="text-xs font-medium">
//                             {p.currentProgress}%
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-xs">
//                         <p className="font-semibold">
//                           {relativeDay(p.predictedEta)}
//                         </p>
//                         <p className="text-muted-foreground">
//                           {formatDateTime(p.predictedEta)}
//                         </p>
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         <div className="flex items-center gap-2">
//                           <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
//                             <div
//                               className={cn(
//                                 "h-full rounded-full",
//                                 p.confidencePct > 80
//                                   ? "bg-success"
//                                   : p.confidencePct > 60
//                                     ? "bg-warning"
//                                     : "bg-destructive",
//                               )}
//                               style={{ width: `${p.confidencePct}%` }}
//                             />
//                           </div>
//                           <span className="text-xs font-semibold">
//                             {p.confidencePct}%
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         {p.delayMinutes > 0 ? (
//                           <span className="text-xs font-semibold text-destructive">
//                             +{p.delayMinutes}m
//                           </span>
//                         ) : (
//                           <span className="text-xs font-semibold text-success">
//                             On time
//                           </span>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <span
//                           className={cn(
//                             "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
//                             riskMeta[p.riskLevel].class,
//                           )}
//                         >
//                           <span
//                             className={cn(
//                               "h-1.5 w-1.5 rounded-full",
//                               riskMeta[p.riskLevel].dot,
//                             )}
//                           />
//                           {riskMeta[p.riskLevel].label}
//                         </span>
//                       </TableCell>
//                       <TableCell>
//                         <Link to={`/app/shipments/${p.shipmentId}`}>
//                           <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
//                         </Link>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           ) : (
//             <EmptyState
//               icon={Clock}
//               title="No predictions"
//               description="ETA predictions will appear here."
//             />
//           )}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Gauge className="h-4 w-4 text-warning" />
//             Risk Factors
//           </CardTitle>
//           <CardDescription>
//             Key factors affecting delayed shipments
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-2.5">
//           {highRisk.length > 0 ? (
//             highRisk.map((p) => (
//               <div
//                 key={p.id}
//                 className="rounded-lg border border-destructive/20 bg-destructive/5 p-4"
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="font-mono text-sm font-semibold">
//                     {p.trackingNumber}
//                   </span>
//                   <span className="text-xs font-semibold text-destructive">
//                     +{p.delayMinutes}m delay · {p.confidencePct}% confidence
//                   </span>
//                 </div>
//                 <div className="mt-2 flex flex-wrap gap-1.5">
//                   {p.factors.map((f) => (
//                     <Badge key={f} variant="outline" className="text-[10px]">
//                       {f}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="py-6 text-center text-sm text-muted-foreground">
//               No high-risk shipments detected.
//             </p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }