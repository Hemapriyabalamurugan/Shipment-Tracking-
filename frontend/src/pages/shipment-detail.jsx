// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useShipment } from "@/lib/hooks";
// import { MapView } from "@/components/shared/map-view";
// import { TrackingTimeline } from "@/components/shared/tracking-timeline";
// import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
// import { LoadingState, EmptyState } from "@/components/shared/states";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   formatCurrency,
//   formatDateTime,
//   formatNumber,
//   relativeDay,
// } from "@/lib/utils";
// import {
//   ArrowLeft,
//   Package,
//   MapPin,
//   Weight,
//   Boxes,
//   Truck,
//   Plane,
//   Ship,
//   Train,
//   Building2,
//   Calendar,
//   DollarSign,
//   Navigation,
//   Printer,
//   Share2,
// } from "lucide-react";

// const modeIcon = {
//   road: Truck,
//   air: Plane,
//   ocean: Ship,
//   rail: Train,
//   multimodal: Truck,
// };

// export function ShipmentDetailPage() {
//   const { id } = useParams();
//   const { data: shipment, isLoading } = useShipment(id);
//   const navigate = useNavigate();

//   if (isLoading) {
//     return (
//       <div>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => navigate(-1)}
//           className="mb-4"
//         >
//           <ArrowLeft className="mr-1.5 h-4 w-4" />
//           Back
//         </Button>
//         <LoadingState label="Loading shipment…" />
//       </div>
//     );
//   }

//   if (!shipment) {
//     return (
//       <div>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => navigate(-1)}
//           className="mb-4"
//         >
//           <ArrowLeft className="mr-1.5 h-4 w-4" />
//           Back
//         </Button>
//         <EmptyState
//           icon={Package}
//           title="Shipment not found"
//           description="This shipment may have been removed or the link is invalid."
//           action={
//             <Button asChild>
//               <Link to="/app/shipments">View all shipments</Link>
//             </Button>
//           }
//         />
//       </div>
//     );
//   }

//   const ModeIcon = Truck;

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Header */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-start gap-3">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => navigate(-1)}
//             className="mt-0.5"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div className="space-y-1.5">
//             <div className="flex flex-wrap items-center gap-2">
//               <h1 className="font-mono text-xl font-bold tracking-tight">
//                 {shipment.trackingNumber}
//               </h1>
//               <StatusBadge status={shipment.status} />
//               <PriorityBadge priority={shipment.priority} />
//             </div>
//             <p className="text-sm text-muted-foreground">
//               {shipment.senderCity} → {shipment.receiverCity} · ShipTrack
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm">
//             <Printer className="mr-1.5 h-3.5 w-3.5" />
//             Print
//           </Button>
//           <Button variant="outline" size="sm">
//             <Share2 className="mr-1.5 h-3.5 w-3.5" />
//             Share
//           </Button>
//         </div>
//       </div>

//       {/* Main grid */}
//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
//         {/* Left column */}
//         <div className="space-y-4 lg:col-span-2">
//           {/* Map */}
//           {/* <Card className="overflow-hidden">
//             <div className="relative h-[380px]">
//               <MapView
//                 shipment={shipment}
//                 className="!rounded-none h-[380px]"
//               />
//             </div>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="font-medium">Progress</span>
//                 <span className="font-semibold text-primary">
//                   {shipment.progress}%
//                 </span>
//               </div>
//               <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
//                 <div
//                   className="h-full rounded-full gradient-brand transition-all"
//                   style={{ width: `${shipment.progress}%` }}
//                 />
//               </div>
//               <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
//                 <span className="flex items-center gap-1">
//                   <MapPin className="h-3 w-3" /> {shipment.currentLocation.name}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Navigation className="h-3 w-3" /> {shipment.receiverCity}
//                 </span>
//               </div>
//             </CardContent>
//           </Card> */}

//           {/* Tracking History */}
//           {/* <Card>
//             <CardHeader>
//               <CardTitle>Tracking History</CardTitle>
//               <CardDescription>Chronological shipment events</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <TrackingTimeline events={shipment.events} />
//             </CardContent>
//           </Card> */}
//         </div>

//         {/* Right column */}
//         <div className="space-y-4">
//           {/* Shipment Details */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
//                   <ModeIcon className="h-4 w-4" />
//                 </span>
//                 Shipment Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <DetailRow
//                 icon={Building2}
//                 label="Customer"
//                 // value={shipment.customer}++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                 value={shipment.senderName}
//               />
//               <DetailRow
//                 icon={Truck}
//                 label="Carrier"
//                 // value={`${shipment.carrier} · ${shipment.service}`}
//                 value={shipment.shipmentType}
//               />
//               <DetailRow
//                 icon={Calendar}
//                 label="Pickup"
//                 value={formatDateTime(shipment.pickedUpAt)}
//               />
//               <DetailRow
//                 icon={Calendar}
//                 label="Estimated delivery"
//                 value={`${relativeDay(shipment.estimatedDeliveryAt)} · ${formatDateTime(
//                   shipment.estimatedDeliveryAt,
//                 )}`}
//               />
//               {shipment.actualDelivery && (
//                 <DetailRow
//                   icon={Calendar}
//                   label="Actual delivery"
//                   value={formatDateTime(shipment.actualDelivery)}
//                 />
//               )}
//             </CardContent>
//           </Card>

//           {/* Cargo */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Cargo</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <DetailRow
//                 icon={Weight}
//                 label="Weight"
//                 value={`${formatNumber(shipment.packageWeightKg)} kg`}
//               />
//               <DetailRow
//                 icon={Boxes}
//                 label="Pieces"
//                 // value={String(shipment.pieces)}
//                 value={String("1")}
//               />
//               <DetailRow
//                 icon={DollarSign}
//                 label="Declared value"
//                 value={formatCurrency(shipment.declaredValue)}
//               />
//             </CardContent>
//           </Card>

//           {/* Route */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Route</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               {/* Origin */}
//               <div className="flex gap-3">
//                 <div className="flex flex-col items-center">
//                   <span className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10" />
//                   <span className="mt-1 w-0.5 flex-1 bg-border" />
//                 </div>
//                 <div className="pb-3">
//                   <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
//                     Origin
//                   </p>
//                   <p className="text-sm font-semibold">{shipment.senderCity}</p>
//                   <p className="text-xs text-muted-foreground">
//                     {shipment.senderAddress}
//                   </p>
//                 </div>
//               </div>

//               {/* Destination */}
//               <div className="flex gap-3">
//                 <div className="flex flex-col items-center">
//                   <span className="h-3 w-3 rounded-full bg-success ring-4 ring-success/10" />
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
//                     Destination
//                   </p>
//                   <p className="text-sm font-semibold">
//                     {shipment.receiverCity}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     {shipment.receiverAddress}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// function DetailRow({ icon: Icon, label, value }) {
//   return (
//     <div className="flex items-start gap-3">
//       <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
//         <Icon className="h-4 w-4" />
//       </span>
//       <div className="min-w-0">
//         <p className="text-xs text-muted-foreground">{label}</p>
//         <p className="text-sm font-semibold text-foreground">{value}</p>
//       </div>
//     </div>
//   );
// }

import { useParams, Link, useNavigate } from "react-router-dom";
import { useShipment } from "@/lib/hooks";
import { MapView } from "@/components/shared/map-view";
import { TrackingTimeline } from "@/components/shared/tracking-timeline";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { useQuery } from "@tanstack/react-query";
import { shipmentsApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  relativeDay,
} from "@/lib/utils";
import {
  ArrowLeft,
  Package,
  MapPin,
  Weight,
  Boxes,
  Truck,
  Plane,
  Ship,
  Train,
  Building2,
  Calendar,
  DollarSign,
  Navigation,
  Printer,
  Share2,
  
} from "lucide-react";

const modeIcon = {
  road: Truck,
  air: Plane,
  ocean: Ship,
  rail: Train,
  multimodal: Truck,
};





export function ShipmentDetailPage() {
  const { id } = useParams();
  const { data: shipment, isLoading } = useShipment(id);
  const tracking = useQuery({
    queryKey: ["shipment-tracking", id],
    queryFn: () => shipmentsApi.getTracking(id),
    enabled: !!id,
    refetchInterval: 5000,
  });

  // const tracking = useQuery({
  //   queryKey: ["shipment-tracking", id],
  //   queryFn: () => shipmentsApi.getTracking(id),
  // });

  const trackingData = tracking.data;
  const navigate = useNavigate();

  if (isLoading || tracking.isLoading) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
        <LoadingState label="Loading shipment…" />
      </div>
    );
  }

  if (!shipment) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
        <EmptyState
          icon={Package}
          title="Shipment not found"
          description="This shipment may have been removed or the link is invalid."
          action={
            <Button asChild>
              <Link to="/app/shipments">View all shipments</Link>
            </Button>
          }
        />
      </div>
    );
  }

  // const ModeIcon = modeIcon[shipment.mode];
  const ModeIcon = Truck;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="mt-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-mono text-xl font-bold tracking-tight">
                {shipment.trackingNumber}
              </h1>
              <StatusBadge status={shipment.status} />
              <PriorityBadge priority={shipment.priority} />
            </div>
            <p className="text-sm text-muted-foreground">
              {shipment.senderCity} → {shipment.receiverCity} ·{" "}
              {shipment.carrier}
            </p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Map */}
          <Card className="overflow-hidden">
            <div className="relative h-[700px]">
              {/* =================================================== */}
              {/* <MapView
                shipment={shipment}
                className="!rounded-none h-[380px]"
              /> */}
              <MapView
                tracking={trackingData}
                className="!rounded-none h-[700px]"
              />
              {/* ====================================================== */}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="font-semibold text-primary">
                  {trackingData?.progressPercentage ?? 0}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full gradient-brand transition-all"
                  style={{
                    width: `${trackingData?.progressPercentage ?? 0}%`,
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  {/* <MapPin className="h-3 w-3" /> {shipment.currentLocation.name} */}
                </span>
                <span className="flex items-center gap-1">
                  <Navigation className="h-3 w-3" /> {shipment.receiverCity}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tracking History */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking History</CardTitle>
              <CardDescription>Chronological shipment events</CardDescription>
            </CardHeader>
            <CardContent>
              <TrackingTimeline events={trackingData?.trackingHistory ?? []} />
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Shipment Details */}

          <Card>
            <CardHeader>
              <CardTitle>Delivery Prediction</CardTitle>
              <CardDescription>Live ETA and delivery forecast</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <DetailRow
                icon={Navigation}
                label="Remaining Distance"
                value={`${trackingData?.remainingDistanceKm ?? 0} km`}
              />

              <DetailRow
                icon={Truck}
                label="Estimated Travel Time"
                value={`${trackingData?.estimatedHours ?? 0} hrs ${
                  trackingData?.estimatedMinutes ?? 0
                } mins`}
              />

              <DetailRow
                icon={Calendar}
                label="Estimated Arrival"
                value={formatDateTime(trackingData?.estimatedArrival)}
              />

              <DetailRow
                icon={Package}
                label="Forecast"
                value={trackingData?.deliveryForecast?.forecastStatus}
              />

              <DetailRow
                icon={Package}
                label="Confidence"
                value={`${trackingData?.deliveryForecast?.confidencePercentage}%`}
              />

              <DetailRow
                icon={Package}
                label="Reason"
                value={trackingData?.deliveryForecast?.reason}
              />
            </CardContent>
          </Card>
          <Card>
            {/* <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ModeIcon className="h-4 w-4" />
                </span>
                Shipment Details
              </CardTitle>
              
            </CardHeader> */}

            {/* new thing added */}

            {/* ==================================================== */}
            <CardHeader>
              <CardTitle>Sender</CardTitle>
              <CardDescription>Shipment sender information</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <DetailRow
                icon={Building2}
                label="Name"
                value={shipment.senderName}
              />

              <DetailRow
                icon={Navigation}
                label="Phone"
                value={shipment.senderPhone}
              />

              <DetailRow
                icon={Package}
                label="Email"
                value={shipment.senderEmail}
              />

              <DetailRow
                icon={MapPin}
                label="Address"
                value={`${shipment.senderAddress},
${shipment.senderCity},
${shipment.senderState}
${shipment.senderPostalCode},
${shipment.senderCountry}`}
              />
            </CardContent>

            {/* <CardContent className="space-y-4">
              <DetailRow
                icon={Building2}
                label="Customer"
                value={shipment.customer}
              />
              <DetailRow
                icon={Truck}
                label="Carrier"
                value={`${shipment.carrier} · ${shipment.service}`}
              />
              <DetailRow
                icon={Calendar}
                label="Pickup"
                value={formatDateTime(shipment.pickupAt)}
              />
              <DetailRow
                icon={Calendar}
                label="Estimated delivery"
                value={`${relativeDay(shipment.estimatedDeliveryAt)} · ${formatDateTime(
                  shipment.estimatedDeliveryAt,
                )}`}
              />
              {shipment.actualDelivery && (
                <DetailRow
                  icon={Calendar}
                  label="Actual delivery"
                  value={formatDateTime(shipment.actualDelivery)}
                />
              )}
            </CardContent> */}
          </Card>

          {/* Cargo */}
          <Card>
            <CardHeader>
              <CardTitle>Package</CardTitle>
              <CardDescription>Package information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow
                icon={Package}
                label="Tracking Number"
                value={shipment.trackingNumber}
              />

              <DetailRow
                icon={Truck}
                label="Shipment Type"
                value={shipment.shipmentType}
              />

              <DetailRow
                icon={Weight}
                label="Weight"
                value={`${shipment.packageWeightKg} kg`}
              />

              <DetailRow
                icon={Boxes}
                label="Package Type"
                value={shipment.packageType}
              />

              <DetailRow
                icon={DollarSign}
                label="Declared Value"
                value={formatCurrency(shipment.declaredValue)}
              />

              <DetailRow
                icon={Package}
                label="Description"
                value={shipment.packageDescription}
              />

              <DetailRow
                icon={Package}
                label="Priority"
                value={shipment.priority}
              />

              <DetailRow
                icon={Package}
                label="Status"
                value={shipment.status}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receiver</CardTitle>
              <CardDescription>Delivery recipient information</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <DetailRow
                icon={Building2}
                label="Name"
                value={shipment.receiverName}
              />

              <DetailRow
                icon={Navigation}
                label="Phone"
                value={shipment.receiverPhone}
              />

              <DetailRow
                icon={Package}
                label="Email"
                value={shipment.receiverEmail}
              />

              <DetailRow
                icon={MapPin}
                label="Address"
                value={`${shipment.receiverAddress},
${shipment.receiverCity},
${shipment.receiverState}
${shipment.receiverPostalCode},
${shipment.receiverCountry}`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}