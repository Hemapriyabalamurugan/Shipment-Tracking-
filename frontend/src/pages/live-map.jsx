
import { useVehicles, useShipments } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { MapView } from "@/components/shared/map-view";
import { LoadingState } from "@/components/shared/states";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Map, Truck, Package, Layers } from "lucide-react";

export function LiveMapPage() {
  const vehicles = useVehicles();
  const shipments = useShipments();
  const [layer, setLayer] = useState("vehicles");

  const isLoading = vehicles.isLoading || shipments.isLoading;

  const vehiclePoints =
    vehicles.data
      ?.filter((v) => v.status !== "offline")
      .map((v) => ({
        lat: v.lat,
        lng: v.lng,
        name: `${v.unit} · ${v.driver}`,
        status: v.status,
      })) ?? [];

  const shipmentPoints =
    shipments.data
      ?.filter((s) => ["in_transit", "out_for_delivery"].includes(s.status))
      .flatMap((s) => [
        {
          lat: s.origin.lat,
          lng: s.origin.lng,
          name: `Origin: ${s.trackingNumber}`,
          status: "idle",
        },
        {
          lat: s.currentLocation.lat,
          lng: s.currentLocation.lng,
          name: `${s.trackingNumber} · ${s.currentLocation.name}`,
          status: "active",
        },
        {
          lat: s.destination.lat,
          lng: s.destination.lng,
          name: `Dest: ${s.trackingNumber}`,
          status: "idle",
        },
      ]) ?? [];

  const points = layer === "vehicles" ? vehiclePoints : shipmentPoints;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Live Map"
        description="Real-time fleet and shipment locations"
        icon={Map}
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden p-0">
              <div className="h-[560px]">
                <MapView
                  points={points}
                  zoom={4}
                  className="!rounded-none h-[560px]"
                />
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Map Layer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setLayer("vehicles")}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition",
                    layer === "vehicles"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40",
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-6/10 text-chart-6">
                    <Truck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Vehicles</p>
                    <p className="text-xs text-muted-foreground">
                      {vehiclePoints.length} active
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setLayer("shipments")}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition",
                    layer === "shipments"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40",
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Package className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Active Shipments</p>
                    <p className="text-xs text-muted-foreground">
                      {
                        shipments.data?.filter((s) =>
                          ["in_transit", "out_for_delivery"].includes(s.status),
                        ).length
                      }{" "}
                      in transit
                    </p>
                  </div>
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {layer === "vehicles" ? "Fleet List" : "In-Transit Shipments"}
                </CardTitle>
                <CardDescription>Live positions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[340px] overflow-y-auto scrollbar-thin">
                {layer === "vehicles"
                  ? vehicles.data
                      ?.filter((v) => v.status !== "offline")
                      .map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center gap-2 rounded-lg border border-border p-2.5"
                        >
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              v.status === "active"
                                ? "bg-success"
                                : v.status === "idle"
                                  ? "bg-warning"
                                  : "bg-destructive",
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold">
                              {v.unit}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {v.driver}
                            </p>
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {v.speedKph} km/h
                          </span>
                        </div>
                      ))
                  : shipments.data
                      ?.filter((s) =>
                        ["in_transit", "out_for_delivery"].includes(s.status),
                      )
                      .map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-2 rounded-lg border border-border p-2.5"
                        >
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-mono text-xs font-semibold">
                              {s.trackingNumber}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {s.currentLocation.name}
                            </p>
                          </div>
                          <span className="text-[11px] font-semibold text-primary">
                            {s.progress}%
                          </span>
                        </div>
                      ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}