
// import { useState } from "react";
// import { useDrivers, useDriverPerformance, useVehicles } from "@/lib/hooks";
// import { PageHeader } from "@/components/shared/page-header";
// import { StatCard } from "@/components/shared/stat-card";
// import { MapView } from "@/components/shared/map-view";
// import { LoadingState } from "@/components/shared/states";
// import { Card, CardContent, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { cn } from "@/lib/utils";
// import {
//   Navigation,
//   Star,
//   Clock,
//   Fuel,
//   Gauge,
//   CheckCircle2,
//   AlertTriangle,
//   Truck,
//   Activity,
//   TrendingUp,
//   Phone,
//   Package,
// } from "lucide-react";

// const statusMeta = {
//   on_duty: {
//     label: "On Duty",
//     class: "bg-success/10 text-success",
//     dot: "bg-success",
//   },
//   off_duty: {
//     label: "Off Duty",
//     class: "bg-muted text-muted-foreground",
//     dot: "bg-muted-foreground",
//   },
//   on_break: {
//     label: "On Break",
//     class: "bg-warning/15 text-warning",
//     dot: "bg-warning",
//   },
// };

// export function LiveDriversPage() {
//   const drivers = useDrivers();
//   const perf = useDriverPerformance();
//   const vehicles = useVehicles();
//   const [tab, setTab] = useState("live");

//   const isLoading = drivers.isLoading || perf.isLoading || vehicles.isLoading;

//   const onDuty = drivers.data?.filter((d) => d.status === "on_duty") ?? [];
//   const driverVehicleMap = new Map(vehicles.data?.map((v) => [v.driver, v]));

//   const driverPoints = drivers.data
//     ?.filter((d) => d.status === "on_duty")
//     .map((d) => {
//       const v = driverVehicleMap.get(d.name);
//       return v
//         ? {
//             lat: v.lat,
//             lng: v.lng,
//             name: `${d.name} · ${d.vehicleUnit}`,
//             status: v.status,
//           }
//         : null;
//     })
//     .filter(Boolean);

//   const avgOnTime = perf.data?.length
//     ? Math.round(
//         perf.data.reduce((s, d) => s + d.onTimeRate, 0) / perf.data.length,
//       )
//     : 0;
//   const totalDeliveriesToday =
//     perf.data?.reduce((s, d) => s + d.deliveriesToday, 0) ?? 0;
//   const avgRating = perf.data?.length
//     ? (perf.data.reduce((s, d) => s + d.rating, 0) / perf.data.length).toFixed(
//         1,
//       )
//     : "0";

//   if (isLoading) {
//     return (
//       <div>
//         <PageHeader
//           title="Live Drivers"
//           description="Real-time driver tracking & performance"
//           icon={Navigation}
//         />
//         <LoadingState />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <PageHeader
//         title="Live Drivers"
//         description="Real-time driver tracking & performance monitoring"
//         icon={Navigation}
//       />

//       <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
//         <StatCard
//           label="On Duty"
//           value={onDuty.length}
//           icon={Activity}
//           iconClass="bg-success/10 text-success"
//           footer={`of ${drivers.data?.length ?? 0} total`}
//         />
//         <StatCard
//           label="Deliveries Today"
//           value={totalDeliveriesToday}
//           icon={Package}
//           iconClass="bg-primary/10 text-primary"
//         />
//         <StatCard
//           label="Avg On-Time"
//           value={`${avgOnTime}%`}
//           icon={TrendingUp}
//           iconClass="bg-chart-2/10 text-chart-2"
//           trend={{ value: "+1.2%", direction: "up", positive: true }}
//         />
//         <StatCard
//           label="Avg Rating"
//           value={`★ ${avgRating}`}
//           icon={Star}
//           iconClass="bg-chart-4/10 text-chart-4"
//         />
//       </div>

//       <Tabs value={tab} onValueChange={setTab}>
//         <TabsList>
//           <TabsTrigger value="live">
//             <Navigation className="mr-1.5 h-3.5 w-3.5" />
//             Live Map
//           </TabsTrigger>
//           <TabsTrigger value="performance">
//             <Gauge className="mr-1.5 h-3.5 w-3.5" />
//             Performance
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="live" className="space-y-4">
//           <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
//             <Card className="lg:col-span-2 overflow-hidden p-0">
//               <div className="flex items-center justify-between border-b border-border p-3">
//                 <CardTitle className="flex items-center gap-2 text-sm">
//                   <span className="flex h-2 w-2 animate-pulse-soft rounded-full bg-success" />
//                   Driver Positions
//                 </CardTitle>
//                 <Badge variant="secondary" className="text-[10px]">
//                   {driverPoints.length} tracked
//                 </Badge>
//               </div>
//               <div className="h-[420px]">
//                 <MapView
//                   points={driverPoints}
//                   zoom={4}
//                   className="!rounded-none h-[420px]"
//                 />
//               </div>
//             </Card>

//             <div className="space-y-3 max-h-[460px] overflow-y-auto scrollbar-thin">
//               {drivers.data?.map((d) => {
//                 const v = driverVehicleMap.get(d.name);
//                 return (
//                   <Card key={d.id} className="transition hover:shadow-md">
//                     <CardContent className="p-4">
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-center gap-2.5">
//                           <span
//                             className={cn(
//                               "flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold",
//                               d.status === "on_duty"
//                                 ? "bg-success/10 text-success"
//                                 : d.status === "on_break"
//                                   ? "bg-warning/15 text-warning"
//                                   : "bg-muted text-muted-foreground",
//                             )}
//                           >
//                             {d.name
//                               .split(" ")
//                               .map((n) => n[0])
//                               .join("")}
//                           </span>
//                           <div className="min-w-0">
//                             <p className="truncate text-sm font-semibold">
//                               {d.name}
//                             </p>
//                             <p className="text-[11px] text-muted-foreground">
//                               {d.vehicleUnit}
//                             </p>
//                           </div>
//                         </div>
//                         <span
//                           className={cn(
//                             "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium",
//                             statusMeta[d.status].class,
//                           )}
//                         >
//                           <span
//                             className={cn(
//                               "h-1.5 w-1.5 rounded-full",
//                               statusMeta[d.status].dot,
//                             )}
//                           />
//                           {statusMeta[d.status].label}
//                         </span>
//                       </div>

//                       {v && (
//                         <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-2.5 text-xs">
//                           <div>
//                             <p className="text-[10px] text-muted-foreground">
//                               Speed
//                             </p>
//                             <p className="font-semibold">{v.speedKph} km/h</p>
//                           </div>
//                           <div>
//                             <p className="text-[10px] text-muted-foreground">
//                               Fuel
//                             </p>
//                             <p className="font-semibold">{v.fuelPct}%</p>
//                           </div>
//                           <div>
//                             <p className="text-[10px] text-muted-foreground">
//                               Location
//                             </p>
//                             <p className="truncate font-semibold text-[11px]">
//                               {v.driver === d.name ? "En route" : "—"}
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                       <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
//                         <span className="flex items-center gap-1">
//                           <Phone className="h-3 w-3" /> {d.phone}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Clock className="h-3 w-3" /> {d.hoursOnDuty}h
//                         </span>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="performance" className="space-y-4">
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {perf.data?.map((d) => (
//               <Card key={d.id} className="transition hover:shadow-md">
//                 <CardContent className="p-5">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-3">
//                       <span
//                         className={cn(
//                           "flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold",
//                           d.status === "on_duty"
//                             ? "bg-success/10 text-success"
//                             : "bg-muted text-muted-foreground",
//                         )}
//                       >
//                         {d.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </span>
//                       <div>
//                         <p className="font-semibold">{d.name}</p>
//                         <p className="text-xs text-muted-foreground">
//                           {d.vehicleUnit}
//                         </p>
//                       </div>
//                     </div>
//                     <span
//                       className={cn(
//                         "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium capitalize",
//                         statusMeta[d.status].class,
//                       )}
//                     >
//                       {d.status.replace("_", " ")}
//                     </span>
//                   </div>

//                   <div className="mt-4 flex items-center gap-4">
//                     <div className="flex items-center gap-1.5">
//                       <Star className="h-4 w-4 fill-warning text-warning" />
//                       <span className="text-sm font-bold">{d.rating}</span>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <CheckCircle2 className="h-4 w-4 text-success" />
//                       <span className="text-sm font-bold text-success">
//                         {d.onTimeRate}%
//                       </span>
//                       <span className="text-xs text-muted-foreground">
//                         on-time
//                       </span>
//                     </div>
//                   </div>

//                   <div className="mt-4 grid grid-cols-2 gap-3">
//                     <div className="rounded-lg border border-border p-2.5">
//                       <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
//                         <Truck className="h-3 w-3" />
//                         Deliveries
//                       </p>
//                       <p className="mt-1 text-lg font-bold">
//                         {d.deliveriesToday}
//                       </p>
//                     </div>
//                     <div className="rounded-lg border border-border p-2.5">
//                       <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
//                         <Clock className="h-3 w-3" />
//                         Avg time
//                       </p>
//                       <p className="mt-1 text-lg font-bold">
//                         {d.avgDeliveryTime}h
//                       </p>
//                     </div>
//                     <div className="rounded-lg border border-border p-2.5">
//                       <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
//                         <Fuel className="h-3 w-3" />
//                         Fuel eff.
//                       </p>
//                       <p className="mt-1 text-lg font-bold">
//                         {d.fuelEfficiency}
//                         <span className="text-xs font-normal text-muted-foreground">
//                           {" "}
//                           L/100km
//                         </span>
//                       </p>
//                     </div>
//                     <div className="rounded-lg border border-border p-2.5">
//                       <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
//                         <Gauge className="h-3 w-3" />
//                         Hours
//                       </p>
//                       <p className="mt-1 text-lg font-bold">{d.hoursOnDuty}h</p>
//                     </div>
//                   </div>

//                   <div
//                     className={cn(
//                       "mt-3 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium",
//                       d.incidents > 0
//                         ? "bg-destructive/5 text-destructive"
//                         : "bg-success/5 text-success",
//                     )}
//                   >
//                     {d.incidents > 0 ? (
//                       <AlertTriangle className="h-3.5 w-3.5" />
//                     ) : (
//                       <CheckCircle2 className="h-3.5 w-3.5" />
//                     )}
//                     {d.incidents > 0
//                       ? `${d.incidents} incident(s) reported`
//                       : "Clean record — no incidents"}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }